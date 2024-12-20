import React, { useCallback, useRef, useState } from "react";
import { FlatList, Animated, useWindowDimensions } from "react-native";
import { Button, HStack, View, VStack } from "native-base";
import Savings from "./assets/SVG/Savings";
import Progress from "./assets/SVG/PieChart";
import PieChart from "./assets/SVG/Progress";
import { Step } from "./utils/Step";
import OnboardingStep from "./utils/OnboardingStep";
import Paginator from "./utils/Paginator";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "./utils/colors2";
import { useDispatch } from "react-redux";
import { onBoard } from "./utils/onboardReducer";
import { useRouter } from "expo-router";

enum Direction {
  Back = "Back",
  Next = "Next",
}

const steps: Step[] = [
  {
    id: 1,
    title: "Track Your Savings",
    description:
      "Start your financial journey by tracking your savings. Set goals, monitor your progress, and watch your savings grow over time",
    image: <Savings width={300} height={300} />,
  },
  {
    id: 2,
    title: "Visualize Your Expenses",
    description:
      "Gain insights into your spending habits with our interactive pie charts. See where your money is going and make informed decisions to manage your expenses effectively",
    image: <PieChart width={300} height={300} />,
  },
  {
    id: 3,
    title: "Stay on Top of Your Financial Goals",
    description:
      "Keep track of your financial goals with our intuitive progress bars. Set milestones, track your achievements, and stay motivated on your path to financial success.",
    image: <Progress width={300} height={200} />,
  },
];

const bgs: string[] = [
  COLORS.BLUE[400],
  COLORS.EMERALD[400],
  COLORS.YELLOW[400],
];

const OnboardingScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const dispatch = useDispatch();
  const router = useRouter();

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);

  const viewConfigRef = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onChangeViewableItem = useCallback(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }, []);

  const goDirection = async (direction: Direction) => {
    if (currentIndex === steps.length - 1 && direction === Direction.Next) {
      dispatch(onBoard());
      router.push('./Home');  // Utilisez './Home' pour naviguer vers le fichier Home.jsx
    } else {
      flatListRef.current?.scrollToIndex({
        index: direction === Direction.Back ? currentIndex - 1 : currentIndex + 1,
      });
    }
  };
  
  
  

  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((bg) => bg),
  });

  const isFirstStep = currentIndex === 0;

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: backgroundColor,
      }}
    >
      <VStack space={2} alignItems="center">
        <View width={width} height={(60 * height) / 100}>
          <FlatList
            scrollEnabled={false}
            ref={flatListRef}
            renderItem={({ item }) => <OnboardingStep step={item} />}
            pagingEnabled={true}
            bounces={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={steps}
            keyExtractor={(step: Step) => step.id.toString()}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={1}
            onViewableItemsChanged={onChangeViewableItem}
            viewabilityConfig={viewConfigRef.current}
          />
        </View>
        <Paginator steps={steps} scrollX={scrollX} />
      </VStack>
      <HStack
        position="absolute"
        bottom={10}
        justifyContent="space-between"
        w={width}
        px={5}
      >
        <Button
          onPress={() => goDirection(Direction.Back)}
          variant="unstyled"
          disabled={isFirstStep}
          opacity={isFirstStep ? 0.4 : 1}
          _text={{
            color: "purple.700",
            fontFamily: "SourceBold",
            fontSize: 20,
          }}
          startIcon={
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={COLORS.PURPLE[700]}
            />
          }
        >
          Back
        </Button>
        <Button
          variant="unstyled"
          _text={{
            color: "purple.700",
            fontFamily: "SourceBold",
            fontSize: 20,
          }}
          onPress={() => goDirection(Direction.Next)}
          endIcon={
            <Ionicons
              name="arrow-forward-outline"
              size={24}
              color={COLORS.PURPLE[700]}
            />
          }
        >
          Next
        </Button>
      </HStack>
    </Animated.View>
  );
};

export default OnboardingScreen;
