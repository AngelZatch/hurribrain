import { View } from "react-native";
import { Question, QuestionDifficulty } from "@/api/play.api";
import { OutlinedText } from "./ui/OutlinedText";

type TurnTimerProps = {
  timeLeft: number;
  difficulty: Question["difficulty"];
};

type DifficultyColorMap = {
  [key in QuestionDifficulty]: {
    fillColor: string;
    stroke: string;
  };
};

const formatSeconds = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins.toString().padStart(0, "0")}:${secs.toString().padStart(2, "0")}`;
};

export default function TurnTimer({
  timeLeft,
  difficulty = "unknown",
}: TurnTimerProps) {
  const difficultyColorMap: DifficultyColorMap = {
    easy: {
      fillColor: "linear-gradient(to bottom, #3dc96c, #5df48e)",
      stroke: "#23932d",
    },
    medium: {
      fillColor: "linear-gradient(to bottom, #d1a256, #b27511)",
      stroke: "#7a5f09",
    },
    hard: {
      fillColor: "linear-gradient(to bottom, #e0521e, #e78764)",
      stroke: "#84420d",
    },
    expert: {
      fillColor: "linear-gradient(to bottom, #990000, #742f15)",
      stroke: "#481313",
    },
    unknown: {
      fillColor: "linear-gradient(to bottom, #b0b0b0, #605f5f)",
      stroke: "#3d3c3c",
    },
  };

  return (
    <View
      style={{
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        height: 25,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <SideLines colors={difficultyColorMap[difficulty]} />
      <View
        style={{
          gap: 0,
          flexDirection: "row",
        }}
      >
        {/* <HourGlass colors={difficultyColorMap[difficulty!]} /> */}
        <OutlinedText
          fontSize={24}
          fontFamily="Exo_700Bold"
          fontWeight="700"
          fillColor={difficultyColorMap[difficulty].fillColor}
          strokeColor={difficultyColorMap[difficulty].stroke}
          strokeWidth={2}
          height={40}
          width={80}
          shadowColor="#000000"
          shadowOffsetX={2}
          shadowOffsetY={3}
          shadowOpacity={0.5}
          shadowBlur={2}
          textAnchor="middle"
        >
          {formatSeconds(timeLeft)}
        </OutlinedText>
      </View>
      <SideLines colors={difficultyColorMap[difficulty]} />
    </View>
  );
}

// const HourGlass = ({
//   colors,
// }: {
//   colors: DifficultyColorMap[keyof DifficultyColorMap];
// }) => (
//   <Svg
//     height="30"
//     width="20"
//     style={{
//       minWidth: 20,
//       flexGrow: 1,
//       flexShrink: 1,
//       flexBasis: "auto",
//     }}
//     viewBox="739 242.5 24 24"
//   >
//     <Defs>
//       <LinearGradient
//         id="grad"
//         x1="0.49999999999999994"
//         y1="-3.0616171314629196e-17"
//         x2="0.49999999999999994"
//         y2="0.9999999999999999"
//         gradientTransform=""
//       >
//         <Stop
//           offset="0"
//           stop-color={colors.topBackground}
//           stop-opacity="1"
//         ></Stop>
//         <Stop
//           offset="1"
//           stop-color={colors.bottomBackground}
//           stop-opacity="1"
//         ></Stop>
//       </LinearGradient>
//       <Filter
//         id="shad"
//         x="-0.5918367346938775"
//         y="-1"
//         width="2.306122448979592"
//         height="3.206896551724138"
//         filterUnits="objectBoundingBox"
//         color-interpolation-filters="sRGB"
//       >
//         <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
//         <feColorMatrix
//           in="SourceAlpha"
//           type="matrix"
//           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//         ></feColorMatrix>
//         <feMorphology
//           radius="1"
//           operator="dilate"
//           in="SourceAlpha"
//           result="filter_18656336-431b-80c1-8007-92b123fa6fe6"
//         ></feMorphology>
//         <feOffset dx="2" dy="2"></feOffset>
//         <feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
//         <feColorMatrix
//           type="matrix"
//           values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
//         ></feColorMatrix>
//         <feBlend
//           mode="normal"
//           in2="BackgroundImageFix"
//           result="filter_18656336-431b-80c1-8007-92b123fa6fe6"
//         ></feBlend>
//         <feBlend
//           mode="normal"
//           in="SourceGraphic"
//           in2="filter_18656336-431b-80c1-8007-92b123fa6fe6"
//           result="shape"
//         ></feBlend>
//       </Filter>
//     </Defs>
//     <G id="shape">
//       <Path
//         fill="#url(grad)"
//         filter="url(#shad)"
//         stroke={colors.stroke}
//         strokeWidth={0.5}
//         d="M755.7998046875,262.4998779296875L755.7919921875,257.7000732421875L752.599609375,254.49989318847656L755.7919921875,251.29188537597656L755.7998046875,246.49989318847656L746.2001953125,246.49989318847656L746.2001953125,251.29969787597656L749.400390625,254.49989318847656L746.2001953125,257.6917724609375L746.2001953125,262.4998779296875L755.7998046875,262.4998779296875ZM747.7998046875,250.89979553222656L747.7998046875,248.09999084472656L754.2001953125,248.09999084472656L754.2001953125,250.89979553222656L751,254.09999084472656L747.7998046875,250.89979553222656Z"
//         fill-rule="nonzero"
//       />
//     </G>
//   </Svg>
// );

const SideLines = ({
  colors,
}: {
  colors: DifficultyColorMap[keyof DifficultyColorMap];
}) => (
  <View
    style={{
      width: "100%",
      height: 4,
      backgroundImage: colors.fillColor,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: "100%",
      // Border
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.stroke,
      // Shadow
      boxShadow: "2px 2px 3px #00000033",
    }}
  />
);
