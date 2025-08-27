import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

const CustomFormControlRadioGroup = ({
  mainLabelId,
  mainLabelName,
  margin,
  radioInputType,
  value,
  onChange,
}) => (
  <FormControl sx={{ marginTop: margin, width: "100%" }}>
    <FormLabel
      id={mainLabelId}
      sx={{
        color: "#D3D3D3",
        fontSize: "1.5rem",
        "&.Mui-focused": { color: "#D3D3D3" },
      }}
    >
      {mainLabelName}
    </FormLabel>
    <RadioGroup
      row
      aria-labelledby={mainLabelId}
      name={mainLabelId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {radioInputType.map((input, idx) => (
        <FormControlLabel
          key={idx}
          value={input.value}
          control={
            <Radio
              sx={{
                color: "white",
                "& .MuiSvgIcon-root": { fontSize: 28 },
              }}
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: "1.2rem" }}>
              {input.label}
            </Typography>
          }
        />
      ))}
    </RadioGroup>
  </FormControl>
);

export default CustomFormControlRadioGroup;