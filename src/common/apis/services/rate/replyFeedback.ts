import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from 'react-query';

export interface Params {
  feedback_id: string;
  description: string | any;
  doctor_id: string;
  server_id: string;
}

export const replyFeedback = ({ feedback_id, description, doctor_id, server_id }: Params) => {
  return clinicClient.post(
    `/api/replyFeedback/`,
    formData({
      certificate: getCookie('certificate'),
      feedback_id: feedback_id,
      description: description,
      doctor_id: doctor_id,
      server_id: server_id,
    }),
  );
};

export const useReplyfeedback = () => {
  return useMutation(replyFeedback);
};
