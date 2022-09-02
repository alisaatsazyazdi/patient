import { memo } from 'react';

interface Props extends React.SVGAttributes<SVGElement> {
  color?: string;
  width?: string;
  height?: string;
  className?: string;
}
// eslint-disable-next-line react/display-name
export const Headphone = memo(({ color = '#3f3f79', width = '24', height = '24', className = '', ...rest }: Props) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12V15.9324C2.25 15.9464 2.25 15.9606 2.25 15.9747V15.9747V16V17V18V18.0253V18.0253C2.24999 18.4697 2.24999 18.8408 2.27077 19.1454C2.29241 19.4625 2.33905 19.762 2.45933 20.0524C2.73844 20.7262 3.27379 21.2616 3.94762 21.5407C4.23801 21.661 4.53754 21.7076 4.85464 21.7292C5.15925 21.75 5.53028 21.75 5.97474 21.75H6H6.02526C6.46972 21.75 6.84075 21.75 7.14537 21.7292C7.46247 21.7076 7.76199 21.661 8.05238 21.5407C8.72621 21.2616 9.26156 20.7262 9.54067 20.0524C9.66095 19.762 9.7076 19.4625 9.72923 19.1454C9.75001 18.8408 9.75001 18.4697 9.75 18.0253V18V16V15.9747C9.75001 15.5303 9.75001 15.1592 9.72923 14.8546C9.7076 14.5375 9.66095 14.238 9.54067 13.9476C9.26156 13.2738 8.72621 12.7384 8.05238 12.4593C7.76199 12.339 7.46247 12.2924 7.14537 12.2708C6.84075 12.25 6.46971 12.25 6.02525 12.25H6H5.97475C5.53029 12.25 5.15925 12.25 4.85464 12.2708C4.53754 12.2924 4.23801 12.339 3.94762 12.4593C3.88033 12.4872 3.81441 12.5176 3.75 12.5505V12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12V12.5505C20.1856 12.5176 20.1197 12.4872 20.0524 12.4593C19.762 12.339 19.4625 12.2924 19.1454 12.2708C18.8408 12.25 18.4697 12.25 18.0253 12.25H18H17.9748C17.5303 12.25 17.1592 12.25 16.8546 12.2708C16.5375 12.2924 16.238 12.339 15.9476 12.4593C15.2738 12.7384 14.7384 13.2738 14.4593 13.9476C14.339 14.238 14.2924 14.5375 14.2708 14.8546C14.25 15.1592 14.25 15.5303 14.25 15.9747V16V18V18.0253C14.25 18.4697 14.25 18.8408 14.2708 19.1454C14.2924 19.4625 14.339 19.762 14.4593 20.0524C14.7384 20.7262 15.2738 21.2616 15.9476 21.5407C16.238 21.661 16.5375 21.7076 16.8546 21.7292C17.1592 21.75 17.5303 21.75 17.9747 21.75H18H18.0253C18.4697 21.75 18.8408 21.75 19.1454 21.7292C19.4625 21.7076 19.762 21.661 20.0524 21.5407C20.7262 21.2616 21.2616 20.7262 21.5407 20.0524C21.661 19.762 21.7076 19.4625 21.7292 19.1454C21.75 18.8408 21.75 18.4698 21.75 18.0253V18.0253V18V17V16V15.9747V15.9747C21.75 15.96 21.75 15.9454 21.75 15.9308V12C21.75 6.61522 17.3848 2.25 12 2.25ZM20.25 16C20.25 15.5238 20.2496 15.2042 20.2327 14.9567C20.2163 14.716 20.1868 14.5988 20.1549 14.5216C20.028 14.2154 19.7846 13.972 19.4784 13.8452C19.4012 13.8132 19.284 13.7837 19.0433 13.7673C18.7958 13.7504 18.4762 13.75 18 13.75C17.5238 13.75 17.2042 13.7504 16.9567 13.7673C16.716 13.7837 16.5988 13.8132 16.5216 13.8452C16.2154 13.972 15.972 14.2154 15.8452 14.5216C15.8132 14.5988 15.7837 14.716 15.7673 14.9567C15.7504 15.2042 15.75 15.5238 15.75 16V18C15.75 18.4762 15.7504 18.7958 15.7673 19.0433C15.7837 19.284 15.8132 19.4012 15.8452 19.4784C15.972 19.7846 16.2154 20.028 16.5216 20.1549C16.5988 20.1868 16.716 20.2163 16.9567 20.2327C17.2042 20.2496 17.5238 20.25 18 20.25C18.4762 20.25 18.7958 20.2496 19.0433 20.2327C19.284 20.2163 19.4012 20.1868 19.4784 20.1549C19.7846 20.028 20.028 19.7846 20.1549 19.4784C20.1868 19.4012 20.2163 19.284 20.2327 19.0433C20.2496 18.7958 20.25 18.4762 20.25 18V17V16ZM3.75 16V17V18C3.75 18.4762 3.75041 18.7958 3.76729 19.0433C3.78372 19.284 3.81319 19.4012 3.84515 19.4784C3.97202 19.7846 4.21536 20.028 4.52165 20.1549C4.5988 20.1868 4.71602 20.2163 4.95674 20.2327C5.20421 20.2496 5.5238 20.25 6 20.25C6.4762 20.25 6.79579 20.2496 7.04326 20.2327C7.28399 20.2163 7.4012 20.1868 7.47835 20.1549C7.78464 20.028 8.02798 19.7846 8.15485 19.4784C8.18681 19.4012 8.21629 19.284 8.23271 19.0433C8.24959 18.7958 8.25 18.4762 8.25 18V16C8.25 15.5238 8.24959 15.2042 8.23271 14.9567C8.21629 14.716 8.18681 14.5988 8.15485 14.5216C8.02798 14.2154 7.78464 13.972 7.47835 13.8452C7.4012 13.8132 7.28399 13.7837 7.04326 13.7673C6.79579 13.7504 6.4762 13.75 6 13.75C5.5238 13.75 5.20421 13.7504 4.95674 13.7673C4.71602 13.7837 4.5988 13.8132 4.52165 13.8452C4.21536 13.972 3.97202 14.2154 3.84515 14.5216C3.81319 14.5988 3.78372 14.716 3.76729 14.9567C3.75041 15.2042 3.75 15.5238 3.75 16Z"
        fill={color}
      />
    </svg>
  );
});

export default memo(Headphone);