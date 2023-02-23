import { convertTimeStampToFormattedTime } from '@/common/utils/convertTimeStampToFormattedTime';
import { convertTimeStampToPersianDate } from '@/common/utils/convertTimeStampToPersianDate';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';

type Patient = {
  name: string;
  cell: string;
  nationalCode: string;
  selectServeis: string;
};
interface TurnDetailsDataParam {
  data: {
    bookTime: number;
    waitingTime?: string;
    turnStatus?: string;
    trackingCode: string;
    doctorPhone?: string;
    durationConversation?: string;
    centerName: string;
    receiptLink?: string;
    centerPhone?: string;
    address?: string;
    centerId: string;
    patientInfo: Patient;
    rules?: string[];
  };
  centerType: CenterType;
}

export const turnDetailsData = ({ data, centerType }: TurnDetailsDataParam) => {
  const {
    bookTime,
    trackingCode,
    waitingTime,
    centerName,
    centerPhone,
    address,
    centerId,
    patientInfo,
    receiptLink,
    rules,
    doctorPhone,
    durationConversation,
    turnStatus,
  } = data;

  const dateTime = `${convertTimeStampToFormattedTime(bookTime)} - ${convertTimeStampToPersianDate(bookTime)}`;

  const lists = [
    {
      id: 1,
      name: centerType === CenterType.consult ? 'زمان ارتباط با پزشک' : 'زمان تقریبی نوبت',
      value: centerType === CenterType.consult ? bookTime : dateTime,
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: true,
    },
    {
      id: 2,
      name: 'توضیحات',
      value:
        turnStatus === BookStatus.requested
          ? `${patientInfo.name} عزیز این درخواست به معنی ثبت نوبت نمیباشد. نتیجه درخواست شما پس از بررسی توسط مرکز درمانی از طریق پیامک به شما اطلاع داده می شود. همینطور شما میتوانید وضعیت درخواست خود را از طریق صفحه نوبت های من مشاهده کنید.`
          : 'زمان نوبت اعلام شده، برای حضور در مرکز درمانی بوده و با زمان ویزیت تفاوت دارد.',
      shouldShow: centerType == CenterType.clinic,
      type: 'Label',
      isBoldValue: true,
    },
    {
      id: 3,
      name: 'مدت زمان گفتگو',
      value: `تا ${durationConversation} روز`,
      shouldShow: centerType === CenterType.consult,
      type: 'Text',
      isBoldValue: true,
    },
    // {
    //   id: 4,
    //   name: ` میانگین زمان انتظار در ${centerType === CenterType.clinic ? 'مطب' : 'بیمارستان'}`,
    //   value: waitingTime,
    //   shouldShow: centerType === CenterType.clinic,
    //   type: 'Text',
    //   isBoldValue: false,
    // },
    {
      id: 5,
      name: 'کد پیگیری',
      value: trackingCode,
      shouldShow: true,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 6,
      name: 'نام مرکز',
      value: centerName,
      shouldShow: centerType === CenterType.hospital || turnStatus === BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 7,
      name: 'تماس با مرکز درمانی',
      value: centerPhone,
      buttonAction: () => {
        return (location.href = 'tel:${centerPhone}');
      },
      shouldShow: !!centerPhone,
      type: 'Button',
    },
    {
      id: 8,
      name: 'آدرس مرکز',
      value: address,
      shouldShow: centerId !== '5532',
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 9,
      name: 'نام بیمار',
      value: patientInfo.name,
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 10,
      name: 'شماره بیمار',
      value: patientInfo.cell,
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 11,
      name: 'کدملی بیمار',
      value: patientInfo.nationalCode,
      shouldShow: centerType === CenterType.clinic && turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 12,
      name: 'سرویس انتخاب شده',
      value: patientInfo.selectServeis,
      shouldShow: centerType === CenterType.clinic && turnStatus !== BookStatus.requested,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 13,
      name: 'شماره پزشک',
      value: doctorPhone,
      shouldShow: centerType === CenterType.consult,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 14,
      name: 'لینک قبض نوبت',
      value: receiptLink,
      shouldShow: centerType === CenterType.consult,
      type: 'Text',
      isBoldValue: false,
    },
    {
      id: 15,
      name: centerType === CenterType.consult ? 'نحوه ویزیت آنلاین' : 'قوانین',
      value: rules?.map((items, index) => ({
        id: index,
        name: items,
        type: 'Label',
      })),
      shouldShow: turnStatus !== BookStatus.requested,
      type: 'Accordion',
    },
  ];

  return lists.filter(({ shouldShow }) => shouldShow);
};