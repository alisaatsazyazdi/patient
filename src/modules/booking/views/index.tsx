import { isEmpty } from 'lodash';
import { toast } from 'react-hot-toast';

// Apis
import { useBook } from '@/common/apis/services/booking/book';
import { useBookRequest } from '@/common/apis/services/booking/bookRequest';
import { useSymptoms } from '@/common/apis/services/booking/symptoms';
import { useTermsAndConditions } from '@/common/apis/services/booking/termsAndConditions';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';

// Hooks
import useWebView from '@/common/hooks/useWebView';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

// Components
import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import InfoIcon from '@/common/components/icons/info';
import Recommend from '../components/recommend';
import SelectSymptoms from '../components/selectSymptoms';

// Booking Steps
import Wrapper from '../components/wrapper';
import SelectCenter from './selectCenter';
import SelectService from './selectService';
import SelectTimeWrapper from './selectTime/wrapper';
import SelectUserWrapper from './selectUser/wrapper';
import TurnRequest, { TurnRequestInformation } from './turnRequest/turnRequest';

// Analytics
import { sendGaEvent } from '@/common/services/sendGaEvent';
import { sendBookEvent } from '../events/book';
import { sendSelectCenterEvent } from '../events/selectCenter';
import { sendSelectServiceEvent } from '../events/selectService';
import { sendFirstFreeTimeEvent, sendOtherFreeTimeEvent } from '../events/selectTime';
import { reformattedDoctorInfoForEvent } from '../functions/reformattedDoctorInfoForEvent';

// Constants
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { CENTERS } from '@/common/types/centers';

// Global Store
import { UserInfo } from '@/modules/login/store/userInfo';

// Types
import { Center } from '../types/selectCenter';
import { Service } from '../types/selectService';
import { Symptoms } from '../types/selectSymptoms';
interface BookingStepsProps {
  slug: string;
  defaultStep?: SELECT_CENTER | SELECT_SERVICES | SELECT_TIME | SELECT_USER | BOOK_REQUEST;
}

type SELECT_CENTER = {
  step: 'SELECT_CENTER';
  payload: Partial<Payloads>;
};
type SELECT_SERVICES = {
  step: 'SELECT_SERVICES';
  payload: Pick<Payloads, 'centerId'>;
};
type SELECT_TIME = {
  step: 'SELECT_TIME';
  payload: Pick<Payloads, 'centerId' | 'serviceId'>;
};
type SELECT_USER = {
  step: 'SELECT_USER';
  payload: Pick<Payloads, 'centerId' | 'serviceId' | 'timeId'>;
};

type BOOK_REQUEST = {
  step: 'BOOK_REQUEST';
  payload: Pick<Payloads, 'centerId' | 'serviceId' | 'timeId'>;
};

type Payloads = {
  centerId: string;
  serviceId: string;
  timeId: string;
};

export type Step = 'SELECT_CENTER' | 'SELECT_SERVICES' | 'SELECT_TIME' | 'SELECT_USER' | 'BOOK_REQUEST';

const BookingSteps = (props: BookingStepsProps) => {
  const router = useRouter();
  const isWebView = useWebView();
  const { slug, defaultStep } = props;
  const { data, isLoading, isIdle } = useGetProfileData(
    {
      slug,
    },
    {
      enabled: !!slug,
    },
  );
  const centers = data?.data?.data?.centers;
  const profile = data?.data?.data;
  const [center, setCenter] = useState<any>();
  const [service, setService] = useState<any>();
  const [user, setUser] = useState<any>({});
  const [timeId, setTimeId] = useState('');
  const book = useBook();
  const symptomsAutoComplete = useSymptoms();
  const bookRequest = useBookRequest();
  const termsAndConditions = useTermsAndConditions();
  const getTurnTimeout = useRef<any>();
  const [turnTimeOutModal, setTurnTimeOutModal] = useState(false);
  const [insuranceModal, setInsuranceModal] = useState(false);
  const [insuranceName, setInsuranceName] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [recommendModal, setRecommendModal] = useState(false);
  const [firstFreeTimeErrorText, setFirstFreeTimeErrorText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptoms[]>([]);
  const [symptoms, setSymptoms] = useState<Symptoms[]>([]);
  const [symptomSearchText, setSymptomSearchText] = useState('');

  const [step, setStep] = useState<Step>(defaultStep?.step ?? 'SELECT_CENTER');

  useEffect(() => {
    if (defaultStep?.payload && centers && step !== 'BOOK_REQUEST') {
      const selectedCenter = centers?.find((c: any) => c.id === defaultStep.payload.centerId);
      const selectedService =
        (defaultStep.step === 'SELECT_TIME' || defaultStep.step === 'SELECT_USER') &&
        selectedCenter?.services.find((c: any) => c.id.toString() === defaultStep.payload?.serviceId?.toString());
      setCenter(selectedCenter);
      setService(selectedService);
      defaultStep.step === 'SELECT_USER' && defaultStep.payload.timeId && setTimeId(defaultStep.payload.timeId);
      if (defaultStep.step === 'SELECT_TIME' && selectedService?.can_request) {
        return handleChangeStep('SELECT_USER', { serviceId: selectedService.id });
      }
      setStep(defaultStep?.step ?? 'SELECT_CENTER');
    }
  }, [centers, defaultStep]);

  useEffect(() => {
    const fetchSymptomsAutoComplete = async () => {
      const { data } = await symptomsAutoComplete.mutateAsync(symptomSearchText || profile.group_expertises?.[0]?.name);
      data.length && setSymptoms(data);
      return data;
    };
    profile && fetchSymptomsAutoComplete();
  }, [symptomSearchText, profile]);

  const handleBookAction = async (user: any) => {
    const { insurance_id, insurance_number } = user;
    sendGaEvent({ action: 'P24DrsPage', category: 'book request button', label: 'book request button' });
    if (+center.settings?.booking_enable_insurance && !insurance_id) return toast.error('لطفا بیمه خود را انتخاب کنید.');
    const { data } = await book.mutateAsync({
      request_code: timeId,
      center_id: center?.id!,
      server_id: center.server_id,
      is_webview: isWebView ? 1 : 0,
      first_name: user.name,
      last_name: user.family,
      gender: user.gender,
      cell: user.cell,
      selected_user_id: user.id,
      is_foreigner: user.is_foreigner,
      ...(user.national_code && { national_code: user.national_code }),
      ...(insurance_id && { insurance_id }),
      ...(insurance_number && { insurance_number }),
      ...(selectedSymptoms.length && { symptomes: selectedSymptoms.map(symptoms => symptoms.title).toString() }),
    });
    if (data.status === ClinicStatus.SUCCESS) {
      if (data.payment.reqiure_payment === '1') return router.push(`/factor/${center.id}/${data.book_info.id}`);

      sendBookEvent({
        bookInfo: {
          ...data.book_info,
        },
        doctorInfo: reformattedDoctorInfoForEvent({ center, service, doctor: profile }),
        userInfo: user,
      });
      return router.push(`/receipt/${center.id}/${data.book_info.id}`);
    }

    if (data.status === ClinicStatus.EXPIRE_TIME_SLOT) {
      handleChangeStep('SELECT_TIME');
    }
    toast.error(data.message);

    sendGaEvent({
      action: 'P24DrsPage',
      category: 'BookError',
      label: `BookError press submit button - status: ${data.status} message: ${data.message}`,
    });
    sendGaEvent({
      action: 'bookerror',
      category: center.center_type === 1 ? 'مطب شخصی' : center.name,
      label: data.status,
    });
  };

  const handleBookRequest = async (dataForm: TurnRequestInformation) => {
    const { data } = await bookRequest.mutateAsync({
      center_id: center.id,
      service_id: service.id,
      server_id: center.server_id,
      user_center_id: center.user_center_id,
      files: dataForm.files!,
      description: dataForm.description,
      gender: user.gender,
      cell: user.username,
      name: `${user.name} ${user.family}`,
      ...(user.national_code && { national_code: user.national_code }),
    });
    if (data.status === ClinicStatus.SUCCESS) {
      return router.push(`/receipt/${center.id}/${data.result.book_request_id}`);
    }

    toast.error(data.message);
  };

  const handleChangeStep = (key: Step, payload?: any) => {
    setStep(key);

    if (key === 'BOOK_REQUEST') {
      termsAndConditions.mutate({
        center_id: center.id,
        service_id: service.id,
        user_center_id: center.user_center_id,
      });
    }

    payload &&
      router.push(
        {
          query: {
            ...router.query,
            ...payload,
          },
        },
        undefined,
        { shallow: true },
      );
  };

  const reformatCentersProperty = (centers: any[]) => {
    return (
      centers?.map((center: any) => {
        return {
          ...center,
          freeturn: center.freeturn_text,
          type: center.center_type === 1 ? 'office' : 'hospital',
          phoneNumbers: center.tell_array,
          isDisable: !center.is_active,
          isAvailable: center.freeturns_info?.[0] && center.freeturns_info?.[0]?.available_time < Math.floor(new Date().getTime() / 1000),
          availableTime: center.freeturns_info?.[0] && center.freeturns_info?.[0]?.availalbe_time_text,
        };
      }) ?? []
    );
  };

  useEffect(() => {
    if (step === 'SELECT_TIME') {
      clearTimeout(getTurnTimeout.current);
      getTurnTimeout.current = setTimeout(() => {
        setTurnTimeOutModal(true);
      }, 300000); // 3 min}
    }

    return () => clearTimeout(getTurnTimeout.current);
  }, [step]);

  return (
    <div className="p-5 bg-white rounded-lg">
      {step === 'SELECT_CENTER' && (
        <Wrapper
          title="انتخاب مرکز درمانی"
          Component={SelectCenter}
          data={{
            loading: isLoading || isIdle,
            centers: reformatCentersProperty(centers),
          }}
          nextStep={(center: Center) => {
            const selectedCenter = centers.find((c: { id: string }) => c.id === center.id);
            sendSelectCenterEvent({
              center: selectedCenter,
              doctorInfo: reformattedDoctorInfoForEvent({ center: selectedCenter, doctor: profile }),
            });
            setCenter(selectedCenter);
            if (selectedCenter.services.length === 1) {
              const service = selectedCenter.services[0];
              const payload = {
                centerId: center.id,
                serviceId: service.id,
              };
              setService(service);
              if (service?.can_request) return handleChangeStep('SELECT_USER', payload);
              return handleChangeStep('SELECT_TIME', payload);
            }
            handleChangeStep('SELECT_SERVICES', { centerId: center.id });
          }}
        />
      )}
      {step === 'SELECT_SERVICES' && (
        <Wrapper
          title="انتخاب خدمت"
          Component={SelectService}
          data={{
            loading: isLoading || isIdle || !center,
            services: center?.services?.map((service: any) => ({
              id: service.id,
              name: service.alias_title,
              isDisable: !service.hours_of_work || !service.can_booking || service.can_booking === 0,
            })),
          }}
          nextStep={(service: Service) => {
            const selectedService = center?.services?.find((s: any) => s.id === service.id);
            sendSelectServiceEvent(reformattedDoctorInfoForEvent({ center, service: selectedService, doctor: profile }));
            setService(selectedService);
            if (selectedService?.can_request) return handleChangeStep('SELECT_USER', { serviceId: service.id });
            handleChangeStep('SELECT_TIME', { serviceId: service.id });
          }}
        />
      )}
      {step === 'SELECT_TIME' && (
        <Wrapper
          title={center?.id === CENTERS.CONSULT ? 'انتخاب زمان گفتگو' : 'انتخاب زمان نوبت'}
          Component={SelectTimeWrapper}
          TopComponent={
            profile?.feedback_visit?.two_weeks_data.some((data: any) => data.center_id === center?.id && data.total_non_personal > 2) && (
              <>
                <Text fontSize="sm" fontWeight="medium" className="text-orange-700">
                  <InfoIcon className="inline ml-1" />
                  با توجه به گزارشات مراجعین اخیر پزشک، احتمال عدم موفقیت شما در ویزیت (به دلایلی مثل شلوغی مرکز، عدم حضور پزشک، برخورد منشی
                  و ...) وجود دارد.
                </Text>
                <Divider />
              </>
            )
          }
          data={{
            loading: isLoading || isIdle || !center || !service,
            centerId: center?.id ?? '',
            serviceId: service?.id ?? '',
            userCenterId: center?.user_center_id,
            onFirstFreeTimeError: (errorText: string) => {
              setFirstFreeTimeErrorText(errorText);
              setRecommendModal(true);
            },
            events: {
              onFirstFreeTime: ({ server_name, server_id, status, message, result }: any) =>
                sendFirstFreeTimeEvent({
                  data: { full_date: result?.full_date, status, message },
                  doctorInfo: reformattedDoctorInfoForEvent({ center: { ...center, server_id, server_name }, service, doctor: profile }),
                }),
              onOtherFreeTime: ({ status, message }: any) =>
                sendOtherFreeTimeEvent({
                  data: { status, message },
                  doctorInfo: reformattedDoctorInfoForEvent({ center, service, doctor: profile }),
                }),
            },
          }}
          nextStep={(timeId: string) => {
            sendGaEvent({ action: 'P24DrsPage', category: 'submit book time', label: 'submit book time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'select-earliest-time', label: 'select-earliest-time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'NextButtonToLoginorReg', label: 'NextButtonToLoginorReg' });
            setTimeId(timeId);
            handleChangeStep('SELECT_USER', { timeId });
          }}
        />
      )}
      {step === 'SELECT_USER' && (
        <>
          <Text fontWeight="bold" className="block mb-3">
            برای درمان چه بیماری به پزشک مراجعه کردید؟
          </Text>
          <SelectSymptoms
            symptoms={symptoms}
            title="اضافه کردن نام بیماری"
            placeholder="اضافه کردن نام بیماری"
            modalTitle="نام بیماری"
            listTitle=" پیشنهادها"
            setSelectedSymptoms={setSelectedSymptoms}
            selectedSymptoms={selectedSymptoms}
            setSearchText={setSymptomSearchText}
            searchText={symptomSearchText}
            className="flex items-center gap-1 mb-4 cursor-pointer text-primary"
          />
          <Wrapper
            title="لطفا بیمار را انتخاب کنید"
            Component={SelectUserWrapper}
            data={{
              loading: book.isLoading,
              submitButtonText: service?.free_price !== 0 ? 'ادامه' : 'ثبت نوبت',
            }}
            nextStep={(user: UserInfo) => {
              setUser(user);
              if (service?.can_request) {
                handleChangeStep('BOOK_REQUEST');
                return;
              }
              if (+center.settings?.booking_enable_insurance) {
                setInsuranceModal(true);
                return;
              }
              handleBookAction(user);
            }}
          />
        </>
      )}
      {step === 'BOOK_REQUEST' && (
        <Wrapper
          Component={TurnRequest}
          data={{
            descriptionTitle: 'لطفا توضیحات مورد نیاز خود را وارد کنید',
            checkboxText: 'قوانین را مطالعه کردم و پذیرفتم.',
            placeholder: 'توضیحات ...',
            uploaderTitle: 'لطفا مدارک مورد نیاز خود را بارگذاری کنید',
            rulesBoxTitle: 'شرایط دریافت نوبت از پذیرش24',
            uploadRequired: true,
            getData: () => {},
            rules: termsAndConditions.data?.data?.result,
            loading: bookRequest.isLoading,
          }}
          nextStep={(data: TurnRequestInformation) => {
            if (!data.description) return toast.error('لطفا توضیحات را تکمیل کنید.');
            if (isEmpty(data.files)) return toast.error('لطفا فایل مورد نظر خود را انتخاب کنید.');
            if (!data.checkedRules) return toast.error('لطفا قوانین را بپذیرید.');
            handleBookRequest(data);
          }}
        />
      )}

      <Modal noHeader isOpen={turnTimeOutModal} onClose={() => {}}>
        <div className="flex flex-col space-y-3">
          <Text fontWeight="medium">زمان شما برای دریافت نوبت به پایان رسیده است، لطفا دوباره تلاش کنید.</Text>
          <Button
            block
            onClick={() => {
              handleChangeStep('SELECT_CENTER');
              setTurnTimeOutModal(false);
            }}
          >
            تلاش مجدد
          </Button>
        </div>
      </Modal>
      <Modal title="انتخاب بیمه" isOpen={insuranceModal} onClose={setInsuranceModal}>
        <div className="flex flex-col space-y-3">
          <Autocomplete
            onChange={e => setInsuranceName(e.target.value.value)}
            label="نام بیمه"
            value={{
              label: center?.insurances?.find((item: any) => item.id === insuranceName)?.name,
              value: insuranceName,
            }}
            options={center?.insurances?.map((item: any) => ({ label: item.name, value: item.id }))}
          />
          <TextField value={insuranceNumber} onChange={e => setInsuranceNumber(e.target.value)} label="شماره بیمه" />
          <Button
            loading={book.isLoading}
            block
            onClick={() => handleBookAction({ ...user, insurance_id: insuranceName, insurance_number: insuranceNumber })}
          >
            ثبت نوبت
          </Button>
        </div>
      </Modal>
      <Modal noHeader isOpen={recommendModal} onClose={() => {}} bodyClassName="bg-slate-100 !p-0">
        <div className="flex flex-col space-y-3">
          <Text className="p-5 leading-7 bg-white" fontWeight="bold">
            {firstFreeTimeErrorText}
          </Text>
          <Text fontSize="sm" className="px-5 leading-6">
            برترین پزشکان{' '}
            <Text fontWeight="bold">
              {profile?.expertises?.[0]?.expertise_groups?.[0]?.name} {center?.city ? `در ${center?.city}` : null}
            </Text>{' '}
            از دیدگاه بیماران
          </Text>
          {profile && (
            <Recommend doctorId={profile.id} city={profile.city_en_slug} category={profile.expertises[0]?.expertise_groups[0].en_slug} />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookingSteps;