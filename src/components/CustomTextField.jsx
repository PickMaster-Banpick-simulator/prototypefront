import TextField from "@mui/material/TextField";

const CustomTextField = ({ id, placeholder, label, width, backgroundColor, onChange }) => (
  <TextField
    id={id}
    placeholder={placeholder}
    label={label}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      width,
      backgroundColor,
      color: "white",
      input: {
        color: "white",
        "&::placeholder": {
          borderWidth: 1,
          color: "white",
          opacity: 1,
        },
      },
      "& .MuiOutlinedInput-root.Mui-focused fieldset": {
        borderColor: "#D3D3D3",
        borderWidth: 2,
      },
      label: {
        color: "#D3D3D3",
        "&.Mui-focused": {
          color: "#D3D3D3",
        },
      },
      marginTop: "2rem",
    }}
  />
);

export default CustomTextField;