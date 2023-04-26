import { useGetFreeTurn } from '@/common/apis/services/booking/getFreeTurn';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { sendGaEvent } from '@/common/services/sendGaEvent';
import { CENTERS } from '@/common/types/centers';
import Recommend from '@/modules/booking/components/recommend/recommend';
import useBooking from '@/modules/booking/hooks/booking';
import SelectUserWrapper from '@/modules/booking/views/selectUser/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import messengers from '@/modules/profile/constants/messengers.json';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useProfileSplunkEvent } from '../../hooks/useProfileEvent';
import OnlineVisit from './onlineVisit';

interface OnlineVisitWrapperProps {
  channelType: Array<'phone' | 'whatsapp' | 'eitaa'>;
  doctorId: string;
  title: string;
  price: number;
  slug: string;
  id: string;
  userCenterId: string;
  duration?: string;
  city: {
    slug: string;
    name: string;
  };
  expertise: {
    slug: string;
    name: string;
  };
}

export const OnlineVisitWrapper = (props: OnlineVisitWrapperProps) => {
  const { channelType, doctorId, price, title, userCenterId, slug, id, duration, city, expertise } = props;
  const { handleOpen: handleOpenBookingModal, handleClose: handleCloseBoolingModal, modalProps: bookingModalProps } = useModal();
  const { handleOpen: handleOpenRecommendModal, modalProps: recommendModalProps } = useModal();
  const { profileEvent } = useProfileSplunkEvent();
  const freeTurn = useGetFreeTurn();
  const isWebView = useWebView();
  const [timeId, setTimeId] = useState('');
  const { handleBook: handleBooking, isLoading } = useBooking();
  const router = useRouter();
  const unSuspend = useUnsuspend();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const doctorMessenger = useFeatureValue<any[]>('doctor-messenger', []);

  const checkLogin = (callback: () => any) => {
    if (!isLogin) return handleOpenLoginModal({ state: true, postLogin: callback });
    callback();
  };

  const handleOpenBooking = async () => {
    profileEvent('doctor profile press online visit book button');
    sendGaEvent({ action: 'booking-consult', category: 'click-start-whatsapp-consult', label: 'click-start-whatsapp-consult' });

    const { data } = await freeTurn.mutateAsync({
      center_id: CENTERS.CONSULT,
      service_id: id,
      type: isWebView ? 'app' : 'web',
      user_center_id: userCenterId,
    });

    if (data.status === ClinicStatus.SUCCESS) {
      setTimeId(data.result.request_code);
      handleOpenBookingModal();
      return;
    }
    handleOpenRecommendModal();
  };

  const handleBook = (user: any) => {
    handleBooking(
      {
        timeId,
        user,
        center: {
          id: CENTERS.CONSULT,
          server_id: '1',
        },
      },
      {
        onSuccess(data) {
          handleCloseBoolingModal();
          if (data.payment.reqiure_payment === '1') return router.push(`/factor/${CENTERS.CONSULT}/${data.book_info.id}`);
          router.push(`/receipt/${CENTERS.CONSULT}/${data.book_info.id}`);
        },
        onExpire() {
          handleCloseBoolingModal();
          checkLogin(handleOpenBooking);
        },
        onError(data) {
          handleCloseBoolingModal();
          unSuspend.mutate({ center_id: CENTERS.CONSULT, request_code: timeId });
          return toast.error(data.message);
        },
      },
    );
  };
  const redirectBookingPage = () => {
    profileEvent('doctor profile press online visit book button');
    router.push(`/booking/${slug}/?centerId=${CENTERS.CONSULT}&serviceId=${id}`);
  };

  return (
    <>
      <OnlineVisit
        channel={channelType[0]}
        messengers={doctorMessenger?.find?.(({ id }: any) => id === doctorId)?.messengers}
        duration={duration}
        title="ویزیت آنلاین"
        price={price}
        loading={freeTurn.isLoading}
        onBook={redirectBookingPage}
      />
      <Modal
        title="انتخاب کاربر برای گفتگو با پزشک"
        {...bookingModalProps}
        onClose={() => {
          unSuspend.mutate({ center_id: CENTERS.CONSULT, request_code: timeId });
          bookingModalProps.onClose();
        }}
      >
        <div className="flex flex-col space-y-3">
          <div className="p-2 rounded-md bg-slate-100">
            <Text fontSize="sm" dangerouslySetInnerHTML={{ __html: messengers[channelType[0] as 'igap' | 'phone']?.description }} />
          </div>
          <SelectUserWrapper
            className="pl-1 overflow-auto max-h-72 md:pb-0 pb-28"
            submitButtonText="ادامه"
            onSubmit={handleBook}
            loading={isLoading}
            shouldShowMessengers={false}
          />
        </div>
      </Modal>
      <Modal noHeader {...recommendModalProps} bodyClassName="bg-slate-100" className="bg-slate-100">
        <div className="flex flex-col space-y-5">
          <Text className="p-5 leading-7 bg-white rounded-lg" fontWeight="bold">
            {freeTurn.data?.data?.message}
          </Text>
          <div className="flex flex-col space-y-3">
            <Text fontSize="sm" className="px-5 leading-6">
              برترین پزشکان{' '}
              <Text fontWeight="bold">
                {expertise?.name} {city?.name ? `در ${city?.name}` : null}
              </Text>{' '}
              از دیدگاه بیماران
            </Text>
            <Recommend doctorId={doctorId} city={city.slug} category={expertise.slug} />
          </div>
        </div>
      </Modal>
    </>
  );
};
