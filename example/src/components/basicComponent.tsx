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