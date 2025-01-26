# React Native TimePicker

A customizable clock-style time picker component for React Native. This library allows you to create a visually appealing and fully customizable time picker that supports hours, minutes, and period selection (AM/PM).
![image](https://github.com/user-attachments/assets/6d4ceb73-000a-425f-8183-30102cf58f2b)


## Features

- Customization options of each component
- Drag-and-drop time selection

## Demo

https://github.com/user-attachments/assets/20e90cdb-b379-470a-afd4-a0b25a0b888c

## Installation

To install the library, run:

```bash
npm install react-native-timepicker --save
```

or

```bash
yarn add react-native-timepicker
```

## Usage

Here's an example of how to use the TimePicker component in your project:

```tsx
import TimePicker from "rn-time-picker"

export default function BasicTimePickerExample(){
    return (
        <TimePicker
        radius={120}
        numberRadius={100}
        customStyles={{
          container: {
            backgroundColor: "gray",
            padding: 12,
            borderRadius: 10
          },
          clock: {
            backgroundColor: "#1A1A1D"
          }
        }}
        colors={{ clockActiveColor: "#6A1E55", topActiveColor: "rgba(166, 77, 121,0.7)", topActiveTextColor: "white", }} />

     
    )
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| radius | number | The radius of the clock circle. |

### Optional Props

| Prop | Type | Default Value | Description |
|------|------|---------------|-------------|
| numberRadius | number | radius - 40 | The radius for positioning clock numbers. |
| colors | Colors | See below | Custom colors for the clock elements. |
| initialHour | number | 12 | The initial hour value. |
| initialMinute | number | 0 | The initial minute value. |
| initialPeriod | 'am' \| 'pm' | 'am' | Initial period setting |
| customComponents | Custom Components Object | - | Provide custom React components to override specific parts of the TimePicker. |
| customStyles | CustomStyles | - | Custom styles for the TimePicker and its elements. |
| onValueChange | (hour, minute, period) => void | - | Callback function triggered when the time value changes. |

## Customization

### Custom Styles

You can pass a customStyles object to override default styles for various parts of the TimePicker:

| Key | Type | Description |
|-----|------|-------------|
| container | ViewStyle | Style for the overall container. |
| clock | ViewStyle | Style for the clock's outer circle. |
| activeNumber | TextStyle | Style for the currently selected number. |
| clockText | TextStyle | Style for clock numbers. |
| indicatorLine | ViewStyle | Style for the indicator line. |
| centerComponent | ViewStyle | Style for the clock center component. |

### Custom Components

You can provide your own React components to replace certain elements of the TimePicker:

| Key | Type | Description |
|-----|------|-------------|
| CenterComponent | React.ReactNode | Custom center element of the clock. |
| LineComponent | React.ReactNode | Custom line connecting the center to numbers. |
| EndComponent | React.ReactNode | Custom end component for clock hand. |
| NumberComponent | (props: { value: number, isActive: boolean }) => React.ReactNode | Custom component for clock numbers. |
| TopComponent | (props) => React.ReactNode | Custom top section displaying hours, minutes, and AM/PM. |

### Default Colors

If you don't provide custom colors, the following defaults are used:

```javascript
const defaultColors = {
  clockActiveColor: 'rgb(76, 175, 80)',
  clockActiveTextColor: 'black',
  topActiveColor: 'rgb(200, 230, 201)',
  topInActiveColor: 'rgb(240, 240, 240)',
  topInActiveTextColor: 'rgb(97, 97, 97)',
};
```

### Example with Custom Components

You can also find this is the example app in ***example/src/components/customizedComponent.tsx***

```tsx
import { StyleSheet, Text, TouchableHighlight, View, TextStyle, ViewStyle } from 'react-native';
import TimePicker, { Mode } from "rn-time-picker";

interface NumberComponentProps {
  value: number;
  isActive: boolean;
}

interface TopComponentProps {
  hour: number;
  minute: number;
  switchMode: (mode: Mode) => void;
  activeMode: Mode;
  period: "am" | "pm";
  setPeriod: (period: "am" | "pm") => void;
}

interface StyleTypes {
  container: ViewStyle;
  timePickerContainer: ViewStyle;
  timePickerClock: ViewStyle;
  activeNumber: TextStyle;
  inActiveNumber: TextStyle;
  numberComponent: TextStyle;
  activeNumberComponent: ViewStyle;
  timeText: TextStyle;
  activeTimeText: ViewStyle;
  amPmContainer: ViewStyle;
  periodContainer: ViewStyle;
  activePeriodAM: ViewStyle;
  activePeriodPM: ViewStyle;
  amPmText: TextStyle;
  activePeriodText: TextStyle;
}

export default function CustomizedTimePickerExample(): JSX.Element {
  const NumberComponent = ({ value, isActive }: NumberComponentProps): JSX.Element => (
    <Text style={[
      styles.numberComponent,
      isActive && styles.activeNumberComponent
    ]}>
      {value}
    </Text>
  );

  const TopComponent = ({
    hour,
    minute,
    switchMode,
    activeMode,
    period,
    setPeriod
  }: TopComponentProps): JSX.Element => {
    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.timeText,
            activeMode === Mode.HOUR && styles.activeTimeText
          ]}
          onPress={() => switchMode(Mode.HOUR)}
        >
          {hour.toString().padStart(2, "0")}
        </Text>

        <Text
          style={[
            styles.timeText,
            activeMode === Mode.MINUTE && styles.activeTimeText
          ]}
          onPress={() => switchMode(Mode.MINUTE)}
        >
          {minute.toString().padStart(2, "0")}
        </Text>

        <TouchableHighlight
          onPress={() => setPeriod(period === "am" ? "pm" : "am")}
          style={styles.amPmContainer}
        >
          <>
            <View
              style={[
                styles.periodContainer,
                period === "am" && styles.activePeriodAM
              ]}
            >
              <Text
                style={[
                  styles.amPmText,
                  period === "am" && styles.activePeriodText
                ]}
              >
                AM
              </Text>
            </View>

            <View
              style={[
                styles.periodContainer,
                period === "pm" && styles.activePeriodPM
              ]}
            >
              <Text
                style={[
                  styles.amPmText,
                  period === "pm" && styles.activePeriodText
                ]}
              >
                PM
              </Text>
            </View>
          </>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <TimePicker
      radius={140}
      numberRadius={110}
      customComponents={{
        NumberComponent,
        TopComponent
      }}
      customStyles={{
        container: styles.timePickerContainer,
        clock: styles.timePickerClock,
        activeNumber: styles.activeNumber,
        inActiveNumber: styles.inActiveNumber
      }}
      colors={{
        clockActiveColor: "#FF6500",
        topActiveColor: "#0B192C",
        topActiveTextColor: "white",
        topInActiveTextColor: "black"
      }}
    />
  );
}

const styles = StyleSheet.create<StyleTypes>({
  container: {
    flexDirection: "row",
    gap: 12,
  },
  timePickerContainer: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 10
  },
  timePickerClock: {
    backgroundColor: "#1E3E62"
  },
  activeNumber: {
    fontSize: 19,
    width: 40,
    height: 40
  },
  inActiveNumber: {
    fontSize: 19,
    width: 40,
    height: 40
  },
  numberComponent: {
    height: 55,
    width: 55,
    borderRadius: 100,
    zIndex: 10,
    textAlignVertical: "center",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 20,
    color: "white"
  },
  activeNumberComponent: {
    backgroundColor: "#FF6500"
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: "rgba(30, 62, 98,0.7)",
    padding: 12,
    borderRadius: 12,
    color: "white"
  },
  activeTimeText: {
    backgroundColor: "#FF6500"
  },
  amPmContainer: {
    flexDirection: "column",
    borderColor: "black",
    borderWidth: 1,
  },
  periodContainer: {
    padding: 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activePeriodAM: {
    backgroundColor: "#32CD32"
  },
  activePeriodPM: {
    backgroundColor: "#FFD700"
  },
  amPmText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activePeriodText: {
    color: "#FFFFFF"
  }
});
```

## License

This project is licensed under the MIT License.
