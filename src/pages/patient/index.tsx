import Head from 'next/head';

import Avatar from '@/common/components/atom/avatar';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import BookmarkIcon from '@/common/components/icons/bookmark';
import CalenderIcon from '@/common/components/icons/calender';
import DoctorIcon from '@/common/components/icons/doctor';
import EditIcon from '@/common/components/icons/edit';
import HeadphoneIcon from '@/common/components/icons/headphone';
import LogoutIcon from '@/common/components/icons/logout';
import ShareIcon from '@/common/components/icons/share';
import StarIcon from '@/common/components/icons/star';
import UsersIcon from '@/common/components/icons/users';
import AppBar from '@/common/components/layouts/appBar';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextPageWithLayout } from '../_app';

export const PatinetProfile: NextPageWithLayout = () => {
  const { query, replace } = useRouter();
  const userInfo = useUserInfoStore(state => state.info);
  const loginPending = useUserInfoStore(state => state.pending);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { openLoginModal } = useLoginModalContext();

  useEffect(() => {
    !isLogin &&
      !loginPending &&
      openLoginModal({
        state: true,
      });
  }, [isLogin, loginPending]);

  useEffect(() => {
    if (!query.isWebView) {
      replace('/patient/appointments');
    }
  }, []);

  return (
    <>
      <Head>
        <title>ویرایش اطلاعات من</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <AppBar title="پروفایل من" />

      <div className="h-screen">
        <Link href="/patient/profile?referrer=profile&isWebView=1">
          <a>
            <div className="flex p-5 items-center space-s-5 bg-white shadow-sm border-t border-slate-200">
              <Avatar name={`${userInfo.name ?? ''} ${userInfo.family ?? ''}`} src={userInfo.image ?? ''} />
              <div className="flex flex-col space-y-2">
                {!userInfo.name ? (
                  <>
                    <Skeleton h="1rem" w="8rem" rounded="full" />
                    <Skeleton h="1rem" rounded="full" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Text fontWeight="bold" className="line-clamp-1">
                        {userInfo.name} {userInfo.family}
                      </Text>
                      <EditIcon className="w-5 h-5" />
                    </div>
                    <Text fontSize="sm">{userInfo.username}</Text>
                  </>
                )}
              </div>
            </div>
          </a>
        </Link>
        <div className="flex flex-col mt-2 bg-white shadow-sm">
          <Link href="/patient/appointments?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <CalenderIcon />
              <Text fontWeight="medium">نوبت های من</Text>
            </a>
          </Link>
          <Link href="/patient/bookmarks?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <BookmarkIcon />
              <Text fontWeight="medium">لیست پزشکان من</Text>
            </a>
          </Link>
          <Link href="/patient/subuser?referrer=profile&isWebView=1">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <UsersIcon />
              <Text fontWeight="medium">کاربران زیرمجموعه</Text>
            </a>
          </Link>
        </div>
        <div className="flex flex-col mt-2 bg-white shadow-sm">
          <Link href="https://www.paziresh24.com/home/support-form/">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <HeadphoneIcon />
              <Text fontWeight="medium">پشتیبانی</Text>
            </a>
          </Link>
          <Link href="https://www.paziresh24.com/home/fordoctors/">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <DoctorIcon />
              <Text fontWeight="medium">پزشک یا منشی هستید؟</Text>
            </a>
          </Link>
        </div>
        <div className="flex flex-col mt-2 bg-white shadow-sm">
          <div
            className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100"
            onClick={() => {
              window.Android.rateApp();
            }}
          >
            <StarIcon />
            <Text fontWeight="medium">امتیاز به پذیرش24</Text>
          </div>

          <div
            className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100"
            onClick={() => {
              window.Android.shareQA('اپلیکیشن نوبت دهی پذیرش24', 'https://www.paziresh24.com/app');
            }}
          >
            <ShareIcon />
            <Text fontWeight="medium">معرفی پذیرش24 به دوستان</Text>
          </div>
          <Link href="/logout">
            <a className="py-4 flex items-center space-s-3 whitespace-nowrap px-5 border-b border-slate-100">
              <LogoutIcon />
              <Text fontWeight="medium">خروج</Text>
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {},
  };
}

export default PatinetProfile;