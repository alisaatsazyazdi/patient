import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

interface ReviewParams {
  external_id: string;
}

export const getReviews = async (params: ReviewParams) => {
  return await apiGatewayClient.get(`/t/external_id/${params.external_id}.json`);
};

export const useGetReview = (params: ReviewParams, options?: any) =>
  useQuery([ServerStateKeysEnum.Reviews, params], () => getReviews(params), options);
