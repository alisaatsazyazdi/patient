import { useEditSubuser } from '@/common/apis/services/auth/subuser/editSubuser';
import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text/text';
import EditIcon from '@/common/components/icons/edit';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormFields, PatinetProfileForm } from '@/modules/patient/views/form';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { uniqMessengers } from '../../functions/uniqMessengers';
import Select from '../select';

interface UserCardProps {
  name: string;
  family: string;
  cell: string;
  nationalCode: string;
  userId: string;
  gender: string;
  isForeigner: boolean;
  refetchData?: () => void;
  select: boolean;
  onSelect: (id: string, payload?: Record<string, unknown>) => void;
  type: 'user' | 'subUser';
  shouldShowMessengers: boolean;
}

export const UserCard = (props: UserCardProps) => {
  const { userId, name, family, cell, nationalCode, isForeigner, gender, refetchData, select, onSelect, type, shouldShowMessengers } =
    props;

  const editSubuser = useEditSubuser();
  const updateUser = useUpdateUser();
  const { handleOpen, handleClose, modalProps } = useModal();
  const allMessenger = useProfileDataStore.getState().messenger;
  const messengers = useFeatureValue<any>('channeldescription', {});
  const doctorMessenger = Object.values(messengers).filter((item: any) =>
    uniqMessengers(allMessenger, Object.keys(messengers)).includes(item.type),
  );

  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const fields = useMemo(
    () =>
      type === 'subUser'
        ? ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL', 'IS_FOREIGNER']
        : ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'IS_FOREIGNER'],
    [type],
  );

  useEffect(() => {
    if (!name) {
      handleOpen();
    }
  }, []);

  const handleEditUser = async (data: any) => {
    if (type === 'user') {
      const res = await updateUser.mutateAsync({
        ...data,
        gender: data.gender.value,
        is_foreigner: data.is_foreigner ? '1' : '0',
        is_foreigner_web: data.is_foreigner,
        user_id: userId,
      });
      if (res.data.status === ClinicStatus.SUCCESS) {
        handleClose();
        setUserInfo(res.data.result);
        return;
      }
      toast.error(res.data.message);
      return;
    }
    const res = await editSubuser.mutateAsync({
      ...data,
      gender: data.gender.value,
      is_foreigner: data.is_foreigner ? '1' : '0',
      is_foreigner_web: data.is_foreigner,
      id: userId,
    });
    if (res.data.status === ClinicStatus.SUCCESS) {
      refetchData && refetchData();
      return;
    }
    if (res.data.status !== ClinicStatus.FORM_VALIDATION) toast.error(res.data.message);
  };

  const handleSelect = (messengerType?: string) => {
    onSelect(userId, {
      ...(messengerType && { messengerType: messengerType }),
    });
  };

  return (
    <>
      <Select
        title={`${name} ${family}`}
        subTitle={cell}
        selected={select}
        onSelect={() => handleSelect()}
        actionText="ویرایش"
        actionIcon={<EditIcon width={18} height={18} />}
        action={() => {
          handleOpen();
          editSubuser.reset();
          updateUser.reset();
        }}
      >
        {select && shouldShowMessengers && (
          <>
            <Text fontWeight="medium" fontSize="sm">
              از کدام پیام رسان برای گفتگو با پزشک استفاده می کنید؟
            </Text>
            <div className="flex items-center mt-3 space-s-3 select-none">
              {doctorMessenger.map((messenger: any) => (
                <div className="w-full" key={messenger.id}>
                  <input
                    onChange={e => e.target.checked && handleSelect(messenger.type)}
                    className="absolute hidden peer"
                    type="radio"
                    name="messagenrs"
                    id={messenger.type}
                  />
                  <label
                    htmlFor={messenger.type}
                    className="flex items-center justify-center w-full py-2 transition-colors border rounded-lg cursor-pointer peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary space-s-2 border-slate-200 text-slate-400"
                  >
                    <img src={messenger.image} width={21} height={21} alt="" />
                    <Text fontWeight="medium">{messenger.name}</Text>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
      </Select>
      <Modal title="ویرایش کاربر" {...modalProps}>
        <PatinetProfileForm
          fields={fields as FormFields}
          defaultValues={{
            NAME: name,
            FAMILY: family,
            NATIONAL_CODE: nationalCode,
            GENDER: gender,
            CELL: cell,
            IS_FOREIGNER: isForeigner,
          }}
          onSubmit={handleEditUser}
          loading={editSubuser.isLoading || updateUser.isLoading}
          errorsField={{
            ...(type === 'subUser'
              ? { ...editSubuser.data?.data?.details }
              : {
                  ...updateUser.data?.data?.details,
                }),
          }}
        />
      </Modal>
    </>
  );
};

export default UserCard;