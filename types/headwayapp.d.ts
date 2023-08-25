declare module '@headwayapp/react-widget' {
  export interface HeadwayWidgetProps {
    account: string;
  }
  const HeadwayWidget: React.FunctionComponent<HeadwayWidgetProps>;
  export default HeadwayWidget;
};