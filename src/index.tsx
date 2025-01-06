import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import throttle from 'lodash.throttle';


type Center = {
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};

type Element = {
  value: number;
  position: Position;
  label: number;
  screenPosition: {
    x: number,
    y: number
  }
};
const defaultColors = {
  selectedColor: 'rgb(76, 175, 80)',
  selectedColorBackground: 'rgb(200, 230, 201)',
  unSelectedColorBackground: 'rgb(240, 240, 240)',
  unSelectedColor: 'rgb(97, 97, 97)',
  backgroundColor: "lightgray"
};





const defaultStyles = (colors: typeof defaultColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
    topComponent: {
      flexDirection: 'row',
      gap: 10,
    },
    topComponentText: {
      fontSize: 20,
      backgroundColor: colors.unSelectedColorBackground,
      padding: 10,
      borderRadius: 8,
      fontWeight: '500',
      color: colors.unSelectedColor
    },
    clockContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10000,
      position: 'relative',
      backgroundColor: "white"
    },
    clock: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
    },
    inactiveNumber: {
      position: 'absolute',
      fontSize: 15,
      fontWeight: 'bold',
      height: 35,
      width: 35,
      textAlign: 'center',
      textAlignVertical: 'center',
      zIndex: 10,
      color: "white"
    },
    indicatorLine: {
      width: 2,
      backgroundColor: colors.backgroundColor,
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 1,
      height: "100%",

    },
    activeNumber: {
      backgroundColor: colors.selectedColor,
      borderRadius: 100,
      height: 35,
      width: 35,
      position: 'absolute',
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 10,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    indicatorEndComponent: {
      backgroundColor: colors.selectedColorBackground,
      width: 35,
      height: 35,
      borderRadius: 10000,
      justifyContent: "center",
      alignItems: "center",
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    indicatorEndComponentInner: {
      backgroundColor: colors.selectedColor,
      width: 10,
      height: 10,
      borderRadius: 10000,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    centerComponent: {
      backgroundColor: 'black',
      width: 10,
      height: 10,
      borderRadius: 10000,
      zIndex: 10,
    },
    AmPmContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: colors.unSelectedColorBackground,
      padding: 0,
      margin: 0,
      borderRadius: 6,
      overflow: "hidden"
    },
    AmPmContainerText: {
      fontSize: 12,
      paddingHorizontal: 8,
      color: colors.unSelectedColor,
      margin: 0,
      fontWeight: "600",

    },
    periodContainer: { flex: 1, justifyContent: "center", alignItems: "center" }
  });

const getIndicatorRotation = (index: number, noOfElements: number) =>
  (index / noOfElements) * 360;

function ElementsComponent({
  radius,
  elements,
  value,
  setValue,
  center,
  step = 1,
  styles,
  customComponents,
  index,
  setIndex

}: {
  radius: number;
  elements: Element[];
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  center: Center;
  step: number;
  styles: ReturnType<typeof defaultStyles>;
  customComponents?: {
    Line?: React.ReactNode;
    EndComponent?: React.ReactNode;
    NumberComponent?: (props: { value: number; position: Position; isActive: boolean }) => React.ReactNode;
  };
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;

}) {

  return (
    <>
      {elements.map(({ position, value: elementValue, label }, currIndex) => (
        (index % step) === 0 && (
          customComponents?.NumberComponent ? (
            customComponents.NumberComponent({ value: elementValue, position, isActive: value === index })
          ) : (
            <Text

              key={currIndex}
              onPress={() => { setValue(elementValue); setIndex(currIndex) }}
              style={[
                styles.inactiveNumber,
               
                (index === currIndex) && styles.activeNumber,
                {
                  left: (position.x -styles.inactiveNumber.width/2),
                  top: (position.y -styles.inactiveNumber.height/2) ,
                },
              ]}
            >
              {label}
            </Text>
          )
        )
      ))}

      <View
        pointerEvents={"none"}
        style={{

          height: (radius - 20),
          transform: [{ rotate: `${getIndicatorRotation(index, elements.length )}deg` }],
          top: (center.y - (radius - 20)),
          position: "absolute",
          transformOrigin: 'bottom',

        }}
      >
        {
          customComponents?.Line ||
          <View style={styles.indicatorLine} />
        }
      </View>
    </>
  );
}

export default function TimePicker({
  radius,
  colors = defaultColors,
  initialHour = 12,
  initialMinute = 0,
  initialPeriod = 'am',
  customComponents,
  clockStyle = {},
  containerStyle = {},
  onValueChange,
}: {
  radius: number;
  colors?: typeof defaultColors;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: 'am' | 'pm';
  customComponents?: {
    CenterComponent?: React.ReactNode;
    LineComponent?: React.ReactNode;
    EndComponent?: React.ReactNode;
    NumberComponent?: (props: { value: number; position: Position; isActive: boolean }) => React.ReactNode;
    TopComponent?: React.ReactNode;
  };
  clockStyle?: Object;
  containerStyle?: Object;
  onValueChange?: ((hour: number, minute: number, period: "am" | "pm") => void)


}) {
  const styles = defaultStyles(colors);
  const containerRef = useRef<View | null>(null);

  const hours = [12, ...Array.from({ length: 11 }, (_, index) => index + 1)];
  const minutes = Array.from({ length: 12 }, (_, index) => index * 5);
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const [period, setPeriod] = useState<'am' | 'pm'>(initialPeriod);
  const [isHourMode, setIsHourMode] = useState(true);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });
  const [hourElements, setHourElements] = useState<Element[]>([]);
  const [minuteElements, setMinuteElements] = useState<Element[]>([]);
  const [index, setIndex] = useState(0);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numbersRadius = radius - 20;
    const hourElements: Element[] = [];
    const minuteElements: Element[] = [];

    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = (i * Math.PI) / (hours.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      console.log("x",x,"y",y)
      hourElements.push({ position: { x, y }, value: hours[i]!, label: i,screenPosition: { x: 0, y: 0 } });
    }
    for (let i = 0; i < minutes.length; i++) {
      const angle = (i * Math.PI) / (minutes.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      minuteElements.push({ position: { x, y }, value: minutes[i]!, label: i * 5, screenPosition: { x: 0, y: 0 } });
    }

    setHourElements(hourElements);
    setMinuteElements(minuteElements);


  };

  useEffect(() => {
    if (onValueChange) {
      onValueChange(hour, minute, period);
    }
  }, [hour, minute, period])

  const switchAnimation = useRef(new Animated.Value(1)).current;

  function switchMode(newMode: boolean) {
    Animated.timing(switchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsHourMode(newMode);
      Animated.timing(switchAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }



  const scaleValueForTransistion = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.2, 1],
  });

  const updateValue = (closestIndex: any, hourMode: any) => {

    setIndex(closestIndex)
    if (hourMode) {
      setHour(hourElements[closestIndex]?.value ?? 0);
    }
    else {
      setMinute(minuteElements[closestIndex]?.value ?? 0);

    }
  }

  const throttledUpdate = throttle(
    async (gestureState: { moveX: number, moveY: number }, elements: Element[]) => {
      const positionXScreen = gestureState.moveX;
      const positionYScreen = gestureState.moveY;
      let closest = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const { position } = element!;
        const distance = Math.sqrt(
          Math.pow(positionXScreen - position.x, 2) +
          Math.pow(positionYScreen - position.y, 2)
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = i;
        }
      }
      updateValue(closest, isHourMode);
    },
    50
  );





  return (
    <View
      style={[styles.container, containerStyle]}>
      {
        customComponents?.TopComponent ||
        <View style={styles.topComponent}>
          <Text
            onPress={() => switchMode(true)}
            style={[
              styles.topComponentText,
              isHourMode && { color: colors.selectedColor, backgroundColor: colors.selectedColorBackground },
            ]}
          >
            {(hour % 12).toString().padStart(2, '0')}
          </Text>
          <Text
            onPress={() => switchMode(false)}
            style={[
              styles.topComponentText,
              !isHourMode && { color: colors.selectedColor, backgroundColor: colors.selectedColorBackground },
            ]}
          >
            {minute.toString().padStart(2, '0')}
          </Text>
          <TouchableHighlight onPress={() => { setPeriod((prev) => prev === "am" ? "pm" : "am") }} style={styles.AmPmContainer}>
            <>
              <View
                style={[styles.periodContainer, period === 'am' && { backgroundColor: colors.selectedColorBackground }]}
              >

                <Text
                  style={[
                    styles.AmPmContainerText,
                    period === 'am' && { color: colors.selectedColor },
                  ]}
                >
                  AM
                </Text>
              </View>
              <View
                style={[styles.periodContainer, period === 'pm' && { backgroundColor: colors.selectedColorBackground }]}
              >

                <Text
                  style={[
                    styles.AmPmContainerText,
                    period === 'pm' && { color: colors.selectedColor },
                  ]}
                >
                  PM
                </Text>
              </View>
            </>
          </TouchableHighlight>
        </View>}
        <View
          ref={containerRef}
          onTouchStart={(event) => {
            throttledUpdate({ moveX: event.nativeEvent.locationX, moveY: event.nativeEvent.locationY }, isHourMode ? hourElements : minuteElements)
          }}
          onTouchMove={(event) => {
            throttledUpdate({ moveX: event.nativeEvent.locationX, moveY: event.nativeEvent.locationY }, isHourMode ? hourElements : minuteElements)
          }}

          style={[styles.clockContainer, clockStyle, { height: radius * 2, width: radius * 2 }]}
          onLayout={handleLayout}
        >
          {customComponents?.CenterComponent || <View style={styles.centerComponent} />}
          <Animated.View
            pointerEvents={"none"}
            style={[
              styles.clock,
              {
                opacity: switchAnimation,
                transform: [{ scale: scaleValueForTransistion }],
              },
            ]}
          >
            <ElementsComponent
              radius={radius}
              value={isHourMode ? hour : minute}
              setValue={isHourMode ? setHour : setMinute}
              elements={isHourMode ? hourElements : minuteElements}
              center={center}
              step={1}
              styles={styles}
              customComponents={{
                Line: customComponents?.LineComponent,
                EndComponent: customComponents?.EndComponent,
                NumberComponent: customComponents?.NumberComponent,
              }}

              setIndex={setIndex}
              index={index}

            />
          </Animated.View>
        </View>
    </View>
  );
}
