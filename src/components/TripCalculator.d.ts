export type TripCalculatorProps = {
  className?: string;
  onGetPassClick?: () => void;
  onViewSampleItineraryClick?: () => void;
  selectedStay?: string;
  onStayChange?: (stayId: string) => void;
};

declare const TripCalculator: (
  props: TripCalculatorProps,
) => import("react/jsx-runtime").JSX.Element;

export default TripCalculator;
