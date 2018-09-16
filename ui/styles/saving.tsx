import { Circle } from "styled-icons/fa-regular/Circle";
import { Check } from "styled-icons/fa-solid/Check";
import styled, { keyframes } from "styled-components";
import { color, font } from "./theme";

const bounce = keyframes`
  0% {
    transform: scale(0.8, 0.8);
    opacity: 0.5;
  }

  50% {
    transform: scale(1, 1);
    opacity: 1;
  }

  100% {
    transform: scale(0.8, 0.8);
    opacity: 0.5;
  }
`;

const AnimationScaleBounce = styled.span`
  display: flex;
  animation: ${bounce} 1.5s ease infinite;
`;

export function Saving({ saving }: { saving: boolean }) {
  return saving ? (
    <AnimationScaleBounce>
      <Circle
        style={{
          width: font._12.size,
          height: font._12.size
        }}
        color={color.jungleGreen}
      />
    </AnimationScaleBounce>
  ) : (
    <Check
      style={{
        width: font._12.size,
        height: font._12.size
      }}
      color={color.jungleGreen}
    />
  );
}
