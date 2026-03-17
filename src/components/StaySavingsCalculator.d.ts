export type StaySavingsCalculatorProps = {
  className?: string;
  defaultStayId?: string;
  defaultNights?: number;
  onStayChange?: (stayId: string) => void;
  onGetPassClick?: () => void;
  onViewAllStayPartnersClick?: () => void;
};

declare const StaySavingsCalculator: (
  props: StaySavingsCalculatorProps,
) => import("react/jsx-runtime").JSX.Element;

export default StaySavingsCalculator;
