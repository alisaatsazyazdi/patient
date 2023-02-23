import { useEditSubuser } from '@/common/apis/services/auth/subuser/editSubuser';
import { useUpdateUser } from '@/common/apis/services/auth/user/updateUser';
import Modal from '@/common/components/atom/modal';
import EditIcon from '@/common/components/icons/edit';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormFields, PatinetProfileForm } from '@/modules/patient/views/form';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
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
  onSelect: (id: string) => void;
  type: 'user' | 'subUser';
}

export const UserCard = (props: UserCardProps) => {
  const { userId, name, family, cell, nationalCode, isForeigner, gender, refetchData, select, onSelect, type } = props;

  const editSubuser = useEditSubuser();
  const updateUser = useUpdateUser();
  const [isOpenEditUserModal, setIsOpenEditUserModal] = useState(false);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const fields: FormFields = useMemo(
    () =>
      type === 'subUser'
        ? ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE', 'CELL', 'IS_FOREIGNER']
        : ['NAME', 'FAMILY', 'GENDER', 'NATIONAL_CODE'],
    [type],
  );

  const handleEditUser = async (data: any) => {
    if (type === 'user') {
      const res = await updateUser.mutateAsync({
        ...data,
        gender: data.gender.value,
        is_foreigner: data.is_foreigner ? '1' : '0',
        is_foreigner_web: data.is_foreigner,
      });
      if (res.data.status === ClinicStatus.SUCCESS) {
        setIsOpenEditUserModal(false);
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

  return (
    <>
      <Select
        title={`${name} ${family}`}
        subTitle={cell}
        selected={select}
        onSelect={() => onSelect(userId)}
        actionText="ویرایش"
        actionIcon={<EditIcon width={18} height={18} />}
        action={() => {
          setIsOpenEditUserModal(true);
          editSubuser.reset();
          updateUser.reset();
        }}
      />
      <Modal title="ویرایش کاربر" isOpen={isOpenEditUserModal} onClose={setIsOpenEditUserModal}>
        <PatinetProfileForm
          fields={fields}
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