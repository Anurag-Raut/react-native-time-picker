import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableHighlight,
  StyleProp,
  ViewStyle,
  TextStyle,
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

type CustomStyles = {
  container?: StyleProp<ViewStyle>;
  clock?: StyleProp<ViewStyle>;
  activeNumber?: StyleProp<TextStyle>;
  clockText?: StyleProp<TextStyle>;
  indicatorLine?: StyleProp<ViewStyle>;
  inActiveNumber?: StyleProp<TextStyle>;
  centerComponent?: StyleProp<ViewStyle>;
}

export type Colors = {
  clockActiveColor?: string,
  clockActiveTextColor?: string,
  topActiveColor?: string,
  topInActiveColor?: string,
  topActiveTextColor?: string,
  topInActiveTextColor?: string,
}

export enum Mode{
  HOUR=0,
  MINUTE=1
}

const defaultColors: Colors = {
  clockActiveColor: 'rgb(76, 175, 80)',
  clockActiveTextColor: "black",
  topActiveColor: 'rgb(200, 230, 201)',
  topInActiveColor: 'rgb(240, 240, 240)',
  topInActiveTextColor: 'rgb(97, 97, 97)',
};







const defaultStyles = (colors: Colors, customStyles: CustomStyles) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      ...StyleSheet.flatten(customStyles?.container || {}),
    },
    topComponent: {
      flexDirection: 'row',
      gap: 10,
    },
    topComponentText: {
      fontSize: 20,
      backgroundColor: colors.topInActiveColor,
      padding: 10,
      borderRadius: 8,
      fontWeight: '500',
      color: colors.topInActiveTextColor,
    },
    clockContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10000,
      position: 'relative',
      backgroundColor: "white",
      ...StyleSheet.flatten(customStyles?.clock || {}),

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
      color: "white",
      ...StyleSheet.flatten(customStyles?.inActiveNumber || {}),
    },
    indicatorLine: {
      width: 2,
      backgroundColor: "lightgray",
      justifyContent: 'flex-start',
      alignItems: 'center',
      zIndex: 1,
      height: "100%",
      ...StyleSheet.flatten(customStyles?.indicatorLine || {}),


    },
    activeNumber: {
      backgroundColor: colors.clockActiveColor,
      borderRadius: 100,
      height: 35,
      width: 35,
      position: 'absolute',
      justifyContent: 'center',
      alignContent: 'center',
      zIndex: 10,
      textAlign: 'center',
      textAlignVertical: 'center',
      ...StyleSheet.flatten(customStyles?.activeNumber || {}),

    },
    centerComponent: {
      backgroundColor: colors.clockActiveColor,
      width: 10,
      height: 10,
      borderRadius: 10000,
      zIndex: 10,
      ...StyleSheet.flatten(customStyles?.centerComponent || {}),
    },
    AmPmContainer: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: colors.topInActiveColor,
      padding: 0,
      margin: 0,
      borderRadius: 6,
      overflow: "hidden"
    },
    AmPmContainerText: {
      fontSize: 12,
      paddingHorizontal: 8,
      color: colors.topInActiveTextColor,
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
    NumberComponent?: (props: { value: number; isActive: boolean }) => React.ReactNode;
  };
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;

}) {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  return (
    <>
      {elements.map(({ position, value: elementValue, label }, currIndex) => (
        (index % step) === 0 && (
          customComponents?.NumberComponent ? (
            <View 
            key={currIndex}
            style={
              
              {
                left: (position.x - dimensions.width / 2),
                top: (position.y - dimensions.height / 2),
                position:"absolute",
                flex:1
              }

            }
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setDimensions({ width, height });
            }}
            >
              <customComponents.NumberComponent
                value={elementValue}
                isActive={index === currIndex}

              />
            </View>
          ) : (
            <Text

              key={currIndex}
              onPress={() => { setValue(elementValue); setIndex(currIndex) }}
              style={[
                styles.inactiveNumber,

                (index === currIndex) && styles.activeNumber,
                {
                  left: (position.x - ((styles?.inactiveNumber?.width || 35) as number) / 2),
                  top: (position.y - ((styles?.inactiveNumber?.height || 35) as number) / 2),
                }

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
          transform: [{ rotate: `${getIndicatorRotation(index, elements.length)}deg` }],
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

/**
 * TimePicker Component
 * 
 * A customizable clock-style time picker that supports hours, minutes, and period (AM/PM).
 * 
 * @param {Object} props - The properties for the TimePicker component.
 * @param {number} props.radius - The radius of the clock circle.
 * @param {number} [props.numberRadius] - The radius for positioning clock numbers (default: radius - 40).
 * @param {Object} [props.colors] - Custom colors for the clock elements.
 * @param {number} [props.initialHour=12] - The initial hour value (default: 12).
 * @param {number} [props.initialMinute=0] - The initial minute value (default: 0).
 * @param {'am' | 'pm'} [props.initialPeriod='am'] - The initial period (default: 'am').
 * @param {Object} [props.customComponents] - Custom components for various parts of the clock.
 * @param {React.ReactNode} [props.customComponents.CenterComponent] - Custom center element of the clock.
 * @param {React.ReactNode} [props.customComponents.LineComponent] - Custom line element connecting the center to numbers.
 * @param {React.ReactNode} [props.customComponents.EndComponent] - Custom end component for clock hand.
 * @param {(props: { value: number; isActive: boolean }) => React.ReactNode} [props.customComponents.NumberComponent]
 *    - Custom number component for clock labels.
 * @param {(props: { hour: number, minute: number, switchMode: (mode: Mode) => void, activeMode: Mode, period: "am" | "pm", setPeriod: (period: "am" | "pm") => void }) => React.ReactNode} 
 *    [props.customComponents.TopComponent] - Custom top section displaying hours, minutes, and AM/PM.
 * @param {Object} [props.customStyles] - Custom styles for the TimePicker and its elements.
 * @param {(hour: number, minute: number, period: "am" | "pm") => void} [props.onValueChange] 
 *    - Callback function triggered when the time value changes.
 * 
 * @returns {JSX.Element} A fully customizable clock-style time picker component.
 */
export default function TimePicker({
  radius,
  numberRadius=radius-40,
  colors = defaultColors,
  initialHour = 12,
  initialMinute = 0,
  initialPeriod = 'am',
  customComponents,
  onValueChange,
  customStyles,
  
}: {
  radius: number;
  numberRadius?:number;
  colors?: Colors;
  initialHour?: number;
  initialMinute?: number;
  initialPeriod?: 'am' | 'pm';
  customComponents?: {
    CenterComponent?: React.ReactNode;
    LineComponent?: React.ReactNode;
    EndComponent?: React.ReactNode;
    NumberComponent?: (props: { value: number; isActive: boolean }) => React.ReactNode;
    TopComponent?:(props: { hour: number; minute: number,switchMode:(mode:Mode)=>void,activeMode:Mode,period: "am" | "pm" ,setPeriod:(period:"am"|"pm")=>void}) =>  React.ReactNode;
  };
  customStyles: CustomStyles,
  onValueChange?: ((hour: number, minute: number, period: "am" | "pm") => void)


}) {

  colors = { ...defaultColors, ...colors }
  const styles = defaultStyles(colors, customStyles);
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
    const numRadius = numberRadius??(radius - 40);
    const hourElements: Element[] = [];
    const minuteElements: Element[] = [];

    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = (i * Math.PI) / (hours.length / 2) - Math.PI / 2;
      const x = centerX + numRadius * Math.cos(angle);
      const y = centerY + numRadius * Math.sin(angle);
      hourElements.push({ position: { x, y }, value: hours[i]!, label: i, screenPosition: { x: 0, y: 0 } });
    }
    for (let i = 0; i < minutes.length; i++) {
      const angle = (i * Math.PI) / (minutes.length / 2) - Math.PI / 2;
      const x = centerX + numRadius * Math.cos(angle);
      const y = centerY + numRadius * Math.sin(angle);
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

  function switchMode(newMode: Mode) {
    Animated.timing(switchAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsHourMode(newMode=== Mode.HOUR);
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
      style={styles.container}>
      {
        customComponents?.TopComponent?
        <customComponents.TopComponent
        hour={hour}
        minute={minute}
        switchMode={switchMode}
        activeMode={isHourMode ? Mode.HOUR : Mode.MINUTE}
        period={period}
        setPeriod={(period)=>setPeriod(period)}
      />
         :
        <View style={styles.topComponent}>
          <Text
            onPress={() => switchMode(Mode.HOUR)}
            style={[
              styles.topComponentText,
              isHourMode && { color: colors.topActiveTextColor, backgroundColor: colors.topActiveColor },
            ]}
          >
            {(hour % 12).toString().padStart(2, '0')}
          </Text>
          <Text
            onPress={() => switchMode(Mode.MINUTE)}
            style={[
              styles.topComponentText,
              !isHourMode && { color: colors.topActiveTextColor, backgroundColor: colors.topActiveColor },
            ]}
          >
            {minute.toString().padStart(2, '0')}
          </Text>
          <TouchableHighlight onPress={() => { setPeriod((prev) => prev === "am" ? "pm" : "am") }} style={styles.AmPmContainer}>
            <>
              <View
                style={[styles.periodContainer, period === 'am' && { backgroundColor: colors.topActiveColor }]}
              >

                <Text
                  style={[
                    styles.AmPmContainerText,
                    period === 'am' && { color: colors.topActiveTextColor },
                  ]}
                >
                  AM
                </Text>
              </View>
              <View
                style={[styles.periodContainer, period === 'pm' && { backgroundColor: colors.topActiveColor }]}
              >

                <Text
                  style={[
                    styles.AmPmContainerText,
                    period === 'pm' && { color: colors.topActiveTextColor },
                  ]}
                >
                  PM
                </Text>
              </View>
            </>
          </TouchableHighlight>
        </View>}
      <View
        onStartShouldSetResponder={() => true}
        onTouchEnd={(e) => {
          e.stopPropagation();
        }}
      >
        <View
          ref={containerRef}
          onStartShouldSetResponder={() => true}
          onTouchStart={(event) => {
            throttledUpdate({ moveX: event.nativeEvent.locationX, moveY: event.nativeEvent.locationY }, isHourMode ? hourElements : minuteElements)
          }}
          onTouchMove={(event) => {
            throttledUpdate({ moveX: event.nativeEvent.locationX, moveY: event.nativeEvent.locationY }, isHourMode ? hourElements : minuteElements)
          }}
          onTouchEnd={(event) => {
            if (isHourMode) {
              throttledUpdate({ moveX: event.nativeEvent.locationX, moveY: event.nativeEvent.locationY }, isHourMode ? hourElements : minuteElements)
              switchMode(Mode.MINUTE)
            }
          }}
          style={[styles.clockContainer, { height: radius * 2, width: radius * 2 }]}
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
              radius={numberRadius??radius-20}
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
    </View>
  );
}
