import { useLogin } from '@/common/apis/services/auth/login';
import { useResetPassword } from '@/common/apis/services/auth/resetPassword';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import Timer from '@/common/components/atom/timer';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { dayToSecond } from '@/common/utils/dayToSecond';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-hot-toast';
import PinInput from 'react-pin-input';
import { useUserInfoStore } from '../../store/userInfo';
import { StepLoginForm } from '../../views/loginForm';
import LoginTitleBar from '../titleBar';

interface OtpCodeProps {
  setStep: Dispatch<SetStateAction<StepLoginForm>>;
  mobileNumberValue: string;
  setMobileNumberValue: Dispatch<SetStateAction<string>>;
  postLogin?: () => void;
  setRetryGetPasswordNumber: Dispatch<SetStateAction<number>>;
  retryGetPasswordNumber: number;
}

export const OtpCode = (props: OtpCodeProps) => {
  const { mobileNumberValue, setStep, postLogin, retryGetPasswordNumber, setRetryGetPasswordNumber } = props;
  const { t } = useTranslation('login');
  const login = useLogin();
  const resetPassword = useResetPassword();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const [password, setPassword] = useState('');
  const [shouldShowResetButton, setShouldShowResetButton] = useState(false);

  const handleLogin = async (password: string) => {
    try {
      const { data } = await login.mutateAsync({
        username: +mobileNumberValue,
        password,
      });

      if (data.status === ClinicStatus.SUCCESS) {
        postLogin && postLogin();

        setCookie('certificate', data.certificate, {
          path: '/',
          maxAge: dayToSecond(60),
        });

        if (window?.Android) window.Android.login(data.certificate);

        setUserInfo({
          is_doctor: data.is_doctor,
          ...data.result,
        });

        return;
      }
      toast.error(data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      }
    }
  };

  const handleReset = async () => {
    if (!shouldShowResetButton) return;
    setShouldShowResetButton(false);
    const { data: resetPasswordRes } = await resetPassword.mutateAsync({
      cell: +mobileNumberValue,
      number_reset_password: retryGetPasswordNumber,
    });
    setRetryGetPasswordNumber(prev => ++prev);
    if (resetPasswordRes.status === ClinicStatus.SUCCESS) {
      return;
    }
    if (resetPasswordRes.status === 39) {
      toast.error(resetPasswordRes.message);
      return setStep('otp_code');
    }
    toast.error(resetPasswordRes.message);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative flex flex-col">
        <LoginTitleBar title={t('steps.second.title')} description={t('steps.second.description', { mobileNumber: mobileNumberValue })} />
        <button className="absolute top-0 self-end px-5 py-1 rounded-md bg-slate-100" onClick={handleReset}>
          {shouldShowResetButton ? (
            <Text fontWeight="semiBold" fontSize="sm">
              {retryGetPasswordNumber >= 3 ? t('steps.second.voiceCallWay') : t('steps.second.resend')}
            </Text>
          ) : (
            <Timer target={120} defaultTime="01:59" ended={() => setShouldShowResetButton(true)} className="!text-slate-500 font-medium" />
          )}
        </button>
      </div>
      <PinInput
        length={4}
        focus
        initialValue=""
        onChange={value => setPassword(value)}
        type="numeric"
        inputMode="number"
        style={{ padding: '10px', direction: 'ltr', alignSelf: 'center' }}
        inputStyle={{ borderColor: '#cbd5e1', borderRadius: '0.6rem', margin: '0 4px' }}
        inputFocusStyle={{ borderColor: '#3861fb' }}
        onComplete={value => handleLogin(value)}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
      />
      <Button size="sm" variant="text" className="underline !text-slate-500" onClick={() => setStep('mobile_number')}>
        {t('steps.second.changeMobileNumber')}
      </Button>

      <Button onClick={() => handleLogin(password)} loading={login.isLoading}>
        {t('steps.second.action')}
      </Button>
    </div>
  );
};

export default OtpCode;
