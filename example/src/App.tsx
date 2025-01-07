import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import TimePicker, { Mode } from 'rn-time-picker';

export default function App() {
  return (
    <View style={styles.container} >
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

      <TimePicker radius={140}
        numberRadius={110}
        customComponents={
          {
            NumberComponent: ({ value, isActive }) => (
              <Text style={{
                height: 55,
                width: 55,
                borderRadius: 100,
                backgroundColor: isActive ? "#FF6500" : undefined,
                zIndex: 10,
                textAlignVertical: "center",
                textAlign: "center",
                fontWeight: "600",
                fontSize: 20,
                color: isActive ? "white" : "white"

              }}>
                {value}
              </Text>
            ),
            TopComponent: ({ hour, minute, switchMode,activeMode, period, setPeriod }) => {
              const styles = StyleSheet.create({
                container: {
                  flexDirection: "row",
                  gap: 12,
                },
                timeText: {
                  fontSize: 18,
                  fontWeight: "600",
                  backgroundColor: "rgba(30, 62, 98,0.7)", 
                  padding: 12,
                  borderRadius: 12,
                  color:"white"
                },
                AmPmContainer: {
                  flexDirection: "column",
                  borderColor:"black",
                  borderWidth:1,
                },
                periodContainer: {
                  padding: 4,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
            

                },
                AmPmContainerText: {
                  fontSize: 12,
                  fontWeight: "600",
                },
              });

              return (
                <View style={styles.container}>
                  <Text
                    style={[styles.timeText,activeMode===Mode.HOUR&&{backgroundColor:"#FF6500"}]}
                    onPress={() => switchMode(Mode.HOUR)}
                  >
                    {(hour).toString().padStart(2, "0")}
                  </Text>

                  <Text
                    style={[styles.timeText,activeMode===Mode.MINUTE&&{backgroundColor:"#FF6500"}]}
                    onPress={() => switchMode(Mode.MINUTE)}
                  >
                    {(minute).toString().padStart(2, "0")}
                  </Text>

                  <TouchableHighlight
                    onPress={() => setPeriod(period === "am" ? "pm" : "am")}
                    style={styles.AmPmContainer}
                  >
                    <>
                      <View
                        style={[
                          styles.periodContainer,
                          period === "am" && { backgroundColor: "#32CD32" }, 
                        ]}
                      >
                        <Text
                          style={[
                            styles.AmPmContainerText,
                            period === "am" && { color: "#FFFFFF" }, // white
                          ]}
                        >
                          AM
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.periodContainer,
                          period === "pm" && { backgroundColor: "#FFD700" }, // gold
                        ]}
                      >
                        <Text
                          style={[
                            styles.AmPmContainerText,
                            period === "pm" && { color: "#FFFFFF" }, // white
                          ]}
                        >
                          PM
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                </View>
              );


            }

          }
        }



        customStyles={{
          container: {
            backgroundColor: "gray",
            padding: 12,
            borderRadius: 10
          },
          clock: {
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
          }
        }}
        colors={{ clockActiveColor: "#FF6500", topActiveColor: "#0B192C", topActiveTextColor: "white", topInActiveTextColor: "black" }} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 50
  },
});
