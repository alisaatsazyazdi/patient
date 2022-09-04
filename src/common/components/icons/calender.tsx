import { memo } from 'react';

// eslint-disable-next-line react/display-name
export const Calender = memo(({ ...rest }: React.SVGAttributes<SVGElement>) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-black" {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75005 1C8.75005 0.585786 8.41426 0.25 8.00005 0.25C7.58584 0.25 7.25005 0.585786 7.25005 1V2.25912C6.53073 2.27754 5.97879 2.33259 5.49054 2.49624C4.07817 2.96962 2.96966 4.07812 2.49629 5.49049C2.24947 6.22688 2.24969 7.10812 2.25002 8.48999L2.25005 8.64706V13L2.25005 13.0564C2.25003 14.8942 2.25002 16.3498 2.40318 17.489C2.56081 18.6614 2.89293 19.6104 3.64129 20.3588C4.38966 21.1071 5.3386 21.4392 6.51103 21.5969C7.65022 21.75 9.10582 21.75 10.9435 21.75H10.9436H11H13H13.0565H13.0566C14.8943 21.75 16.3499 21.75 17.4891 21.5969C18.6615 21.4392 19.6104 21.1071 20.3588 20.3588C21.1072 19.6104 21.4393 18.6614 21.5969 17.489C21.7501 16.3498 21.7501 14.8942 21.75 13.0565V13.0564V13V11V10.9436V10.9435C21.7501 9.1058 21.7501 7.65018 21.5969 6.51098C21.4393 5.33856 21.1072 4.38961 20.3588 3.64124C19.6104 2.89288 18.6615 2.56076 17.4891 2.40313C17.2561 2.37182 17.01 2.34691 16.75 2.32709V1C16.75 0.585786 16.4143 0.25 16 0.25C15.5858 0.25 15.25 0.585786 15.25 1V2.26272C14.588 2.24999 13.8586 2.24999 13.0565 2.25L13 2.25H8.75005V1ZM15.25 4V3.76309C14.5973 3.75032 13.8541 3.75 13 3.75H8.75005V4C8.75005 4.41421 8.41426 4.75 8.00005 4.75C7.58584 4.75 7.25005 4.41421 7.25005 4V3.76077C6.6236 3.77713 6.26733 3.81789 5.96723 3.91848C5.00087 4.24237 4.24242 5.00082 3.91853 5.96718C3.75985 6.44061 3.75005 7.05384 3.75005 8.64706V13C3.75005 14.9068 3.75164 16.2615 3.88981 17.2892C4.02507 18.2952 4.27874 18.8749 4.70195 19.2981C5.12516 19.7213 5.70481 19.975 6.7109 20.1102C7.73856 20.2484 9.09323 20.25 11 20.25H13C14.9069 20.25 16.2615 20.2484 17.2892 20.1102C18.2953 19.975 18.8749 19.7213 19.2981 19.2981C19.7214 18.8749 19.975 18.2952 20.1103 17.2892C20.2485 16.2615 20.25 14.9068 20.25 13V11C20.25 9.09318 20.2485 7.73851 20.1103 6.71085C19.975 5.70476 19.7214 5.12511 19.2981 4.7019C18.8749 4.27869 18.2953 4.02502 17.2892 3.88976C17.1188 3.86685 16.9394 3.8477 16.75 3.83168V4C16.75 4.41421 16.4143 4.75 16 4.75C15.5858 4.75 15.25 4.41421 15.25 4ZM7.00006 7.25C6.58585 7.25 6.25006 7.58579 6.25006 8C6.25006 8.41421 6.58585 8.75 7.00006 8.75H17.0001C17.4143 8.75 17.7501 8.41421 17.7501 8C17.7501 7.58579 17.4143 7.25 17.0001 7.25H7.00006ZM9.00006 12C9.00006 12.5523 8.55235 13 8.00006 13C7.44778 13 7.00006 12.5523 7.00006 12C7.00006 11.4477 7.44778 11 8.00006 11C8.55235 11 9.00006 11.4477 9.00006 12ZM8.00006 17C8.55235 17 9.00006 16.5523 9.00006 16C9.00006 15.4477 8.55235 15 8.00006 15C7.44778 15 7.00006 15.4477 7.00006 16C7.00006 16.5523 7.44778 17 8.00006 17ZM13.0001 16C13.0001 16.5523 12.5523 17 12.0001 17C11.4478 17 11.0001 16.5523 11.0001 16C11.0001 15.4477 11.4478 15 12.0001 15C12.5523 15 13.0001 15.4477 13.0001 16ZM16.0001 17C16.5523 17 17.0001 16.5523 17.0001 16C17.0001 15.4477 16.5523 15 16.0001 15C15.4478 15 15.0001 15.4477 15.0001 16C15.0001 16.5523 15.4478 17 16.0001 17ZM13.0001 12C13.0001 12.5523 12.5523 13 12.0001 13C11.4478 13 11.0001 12.5523 11.0001 12C11.0001 11.4477 11.4478 11 12.0001 11C12.5523 11 13.0001 11.4477 13.0001 12ZM16.0001 13C16.5523 13 17.0001 12.5523 17.0001 12C17.0001 11.4477 16.5523 11 16.0001 11C15.4478 11 15.0001 11.4477 15.0001 12C15.0001 12.5523 15.4478 13 16.0001 13Z"
      />
    </svg>
  );
});

export default memo(Calender);
