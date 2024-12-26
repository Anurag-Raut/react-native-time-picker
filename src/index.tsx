import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  type PanResponderGestureState,
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
    },
    clockContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10000,
      position: 'relative',
      backgroundColor: "gray"
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
      fontSize: 18,
      fontWeight: 'bold',
      height: 35,
      width: 35,
      textAlign: 'center',
      textAlignVertical: 'center',
      zIndex: 10
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
    },
    AmPmContainerText: {
      fontSize: 12,
      paddingHorizontal: 8,
      color: colors.unSelectedColor,
    },
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

}) {
  return (
    <>
      {elements.map(({ position, value: elementValue }, index) => (
        index % step === 0 && (
          customComponents?.NumberComponent ? (
            customComponents.NumberComponent({ value: elementValue, position, isActive: value === index })
          ) : (
            <Text
              key={index}
              onPress={() => setValue(index)}
              style={[
                styles.inactiveNumber,
                {
                  left: position.x - 15,
                  top: position.y - 15,
                },
                value === index && styles.activeNumber,
              ]}
            >
              {elementValue}
            </Text>
          )
        )
      ))}

      <View
        style={{

          height: (radius - 15),
          transform: [{ rotate: `${getIndicatorRotation(value, elements.length)}deg` }],
          top: (center.y - (radius - 15)),
          position: "absolute",
          transformOrigin: 'bottom',

        }}
      >
        {
          customComponents?.Line ||
          <View style={styles.indicatorLine}>

            <View style={styles.indicatorEndComponent} >
              <View style={styles.indicatorEndComponentInner} />
            </View>
          </View>
        }
      </View>
    </>
  );
}

export default function TimePicker({
  radius,
  colors = defaultColors,
  initialHour = 0,
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
    TopComponent?:React.ReactNode;
  };
  clockStyle: Object;
  containerStyle: Object;
  onValueChange:((hour:number,minute:number,period:"am"|"pm")=>void)


}) {
  const styles = defaultStyles(colors);
  const containerRef = useRef<View | null>(null);
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
    screenCenter: Center;
  } | null>(null);
  const hours = [12, ...Array.from({ length: 11 }, (_, index) => index + 1)];
  const minutes = Array.from({ length: 60 }, (_, index) => index);
  const [hour, setHour] = useState<number>(initialHour);
  const [minute, setMinute] = useState<number>(initialMinute);
  const [period, setPeriod] = useState<'am' | 'pm'>(initialPeriod);
  const [isHourMode, setIsHourMode] = useState(true);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });
  const [hourElements, setHourElements] = useState<Element[]>([]);
  const [minuteElements, setMinuteElements] = useState<Element[]>([]);

  const handleLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    const centerX = width / 2;
    const centerY = height / 2;
    const numbersRadius = radius - 30;
    const hourElements: Element[] = [];
    const minuteElements: Element[] = [];

    setCenter({ x: centerX, y: centerY });

    for (let i = 0; i < hours.length; i++) {
      const angle = (i * Math.PI) / (hours.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      hourElements.push({ position: { x, y }, value: hours[i]! });
    }
    for (let i = 0; i < minutes.length; i++) {
      const angle = (i * Math.PI) / (minutes.length / 2) - Math.PI / 2;
      const x = centerX + numbersRadius * Math.cos(angle);
      const y = centerY + numbersRadius * Math.sin(angle);
      minuteElements.push({ position: { x, y }, value: minutes[i]! });
    }
    let screenX = 0,
      screenY = 0;
    containerRef.current?.measure((_, __, ___, ____, scrX: number, scrY: number) => {
      screenX = scrX;
      screenY = scrY;
    });
    setHourElements(hourElements);
    setMinuteElements(minuteElements);
    setLayout({ width, height, screenCenter: { x: screenX, y: screenY } });
  };

  const updateValue = (value: number, isHourMode: boolean) => {
    if (isHourMode) {
      setHour(value);
      
    } else {
      setMinute(value);
    }
  };

  useEffect(()=>{
    onValueChange && onValueChange(hour,minute,period);
  },[hour,minute,period])

  const throttledUpdate = throttle(
    (gestureState: PanResponderGestureState, elements: Element[]) => {
      const positionXScreen = gestureState.moveX - (layout?.screenCenter?.x ?? 0);
      const positionYScreen = gestureState.moveY - (layout?.screenCenter?.y ?? 0);
      let closest = 0;
      let closestDistance = Infinity;

      for (let i = 0; i < elements.length; i++) {
        const { x, y } = elements[i]!.position;
        const distance = Math.abs(positionXScreen - x) + Math.abs(positionYScreen - y);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = i;
        }
      }
      updateValue(closest, isHourMode);
    },
    50
  );


  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      throttledUpdate(gestureState, isHourMode ? hourElements : minuteElements);
    },
  });

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

  const scaleValue = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1.2, 1],
  });

  return (
    <View style={[styles.container, containerStyle]}>
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
          {hour.toString().padStart(2, '0')}
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
        <View style={styles.AmPmContainer}>
          <Text
            onPress={() => setPeriod('am')}
            style={[
              styles.AmPmContainerText,
              period === 'am' && { backgroundColor: colors.selectedColorBackground, color: colors.selectedColor },
            ]}
          >
            AM
          </Text>
          <Text
            onPress={() => setPeriod('pm')}
            style={[
              styles.AmPmContainerText,
              period === 'pm' && { backgroundColor: colors.selectedColorBackground, color: colors.selectedColor },
            ]}
          >
            PM
          </Text>
        </View>
      </View>}
      <View
        ref={containerRef}
        {...panResponder.panHandlers}
        style={[styles.clockContainer, clockStyle, { height: radius * 2, width: radius * 2 }]}
        onLayout={handleLayout}
      >
        {customComponents?.CenterComponent || <View style={styles.centerComponent} />}
        <Animated.View
          style={[
            styles.clock,
            {
              opacity: switchAnimation,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <ElementsComponent
            radius={radius}
            value={isHourMode ? hour : minute}
            setValue={isHourMode ? setHour : setMinute}
            elements={isHourMode ? hourElements : minuteElements}
            center={center}
            step={isHourMode ? 1 : 5}
            styles={styles}
            customComponents={{
              Line: customComponents?.LineComponent,
              EndComponent: customComponents?.EndComponent,
              NumberComponent: customComponents?.NumberComponent,
            }}

          />
        </Animated.View>
      </View>
    </View>
  );
}
