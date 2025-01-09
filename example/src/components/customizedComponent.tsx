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