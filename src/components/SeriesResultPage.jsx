import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import html2canvas from 'html2canvas';
import TeamSlot from './TeamSlot'; 
import GameHistory from './GameHistory';
import SeriesScoreboard from './SeriesScoreboard';
import styles from '../styles/SeriesResultPage.module.css';

const SeriesResultPage = ({ finalBoard, seriesHistory, teamNames }) => {
    const navigate = useNavigate();
    const captureRef = useRef(null);

    const handleCapture = async () => {
        if (!captureRef.current) return;

        try {
            const canvas = await html2canvas(captureRef.current, { 
                backgroundColor: '#111827', // 배경색 지정
                useCORS: true // 외부 이미지를 허용
            });
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `pick-master-result-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("화면 캡처 중 오류 발생:", error);
            alert("화면 캡처에 실패했습니다.");
        }
    };

    return (
        <Container maxWidth="xl" className={styles.pageContainer} ref={captureRef}>
            <SeriesScoreboard isFinal={true} />

            <Box className={styles.banpickLayout}>
                <TeamSlot team="blue" bans={finalBoard.blueBans} picks={finalBoard.bluePicks} />
                
                <Box className={styles.centerContainer}>
                        <Paper className={styles.finalResultBox} elevation={3}>
                                <Typography variant="h4">시리즈 종료</Typography>
                                <Typography gutterBottom>
                                        최종 스코어: {seriesHistory.blueWins} : {seriesHistory.redWins}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                        <Button variant="contained" onClick={handleCapture}>결과 저장 (캡처)</Button>
                                        <Button variant="outlined" onClick={() => navigate('/')}>로비로 돌아가기</Button>
                                </Box>
                        </Paper>
                </Box>

                <TeamSlot team="red" bans={finalBoard.redBans} picks={finalBoard.redPicks} />
            </Box>

            <GameHistory games={seriesHistory.games} teamNames={teamNames} />
        </Container>
    );
};

export default SeriesResultPage;