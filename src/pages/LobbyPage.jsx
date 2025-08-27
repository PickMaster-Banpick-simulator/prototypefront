import { css } from "@emotion/react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        "&.Mui-focused": {
          color: "#D3D3D3",
        },
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
                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                },
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

const Home = () => {
  const navigate = useNavigate();

  const [blueTeam, setBlueTeam] = useState("");
  const [redTeam, setRedTeam] = useState("");
  const [playerMode, setPlayerMode] = useState("solo");
  const [banpickMode, setBanpickMode] = useState("draft");
  const [setCount, setSetCount] = useState("1");
  const [timeLimit, setTimeLimit] = useState("on");

  const handleStart = () => {
    navigate("/game", {
      state: {
        blueTeam,
        redTeam,
        playerMode,
        banpickMode,
        setCount,
        timeLimit,
      },
    });
  };

  return (
    <div
      css={css`
        width: fit-content;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        margin: 0 auto;
      `}
    >
      <h1>롤 게임 벤픽 시뮬레이터</h1>
      <h2>벤픽 시뮬레이션에 오신 것을 환영합니다!</h2>
      <CustomTextField
        id="BlueTeamName"
        placeholder="블루팀 이름을 입력하세요."
        label="블루팀 이름"
        width="100%"
        backgroundColor="blue"
        onChange={setBlueTeam}
      />
      <CustomTextField
        id="RedTeamName"
        placeholder="레드팀 이름을 입력하세요."
        label="레드팀 이름"
        width="100%"
        backgroundColor="red"
        onChange={setRedTeam}
      />
      <CustomFormControlRadioGroup
        mainLabelId="playerMode"
        mainLabelName="플레이어 모드 선택"
        margin="2rem"
        radioInputType={[
          { value: "solo", label: "솔로" },
          { value: "1vs1", label: "1vs1" },
        ]}
        value={playerMode}
        onChange={setPlayerMode}
      />
      <CustomFormControlRadioGroup
        mainLabelId="banpickMode"
        mainLabelName="밴픽 모드 선택"
        margin="1rem"
        radioInputType={[
          { value: "draft", label: "토너먼트 드래프트" },
          { value: "hardFearless", label: "하드 피어리스" },
          { value: "softFearless", label: "소프트 피어리스" },
        ]}
        value={banpickMode}
        onChange={setBanpickMode}
      />
      <CustomFormControlRadioGroup
        mainLabelId="setCount"
        mainLabelName="대회 세트 수 선택"
        margin="1rem"
        radioInputType={[
          { value: "1", label: "단판제" },
          { value: "3", label: "3판 2선승" },
          { value: "5", label: "5판 3선승" },
        ]}
        value={setCount}
        onChange={setSetCount}
      />
      <CustomFormControlRadioGroup
        mainLabelId="timeLimit"
        mainLabelName="시간 제한"
        margin="1rem"
        radioInputType={[
          { value: "on", label: "대회와 동일하게(30초)" },
          { value: "off", label: "시간 무제한" },
        ]}
        value={timeLimit}
        onChange={setTimeLimit}
      />
      <Button
        variant="contained"
        sx={{ marginTop: "1rem" }}
        onClick={handleStart}
      >
        게임 시작하기
      </Button>
    </div>
  );
};

export default Home;
