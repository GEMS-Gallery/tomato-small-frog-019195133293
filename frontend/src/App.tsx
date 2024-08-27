import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.5rem',
  padding: theme.spacing(2),
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '2rem',
  marginBottom: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperatorClick = (op: string) => {
    if (prevValue === null) {
      setPrevValue(parseFloat(display));
      setDisplay('0');
    } else {
      handleEqualsClick();
    }
    setOperator(op);
  };

  const handleEqualsClick = async () => {
    if (prevValue !== null && operator) {
      setLoading(true);
      try {
        const result = await backend.calculate(operator, prevValue, parseFloat(display));
        setDisplay(result.toString());
        setPrevValue(null);
        setOperator('');
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setOperator('');
    setPrevValue(null);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Display>
          {loading ? <CircularProgress size={24} /> : display}
        </Display>
        <Grid container spacing={1}>
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].map((num) => (
            <Grid item xs={3} key={num}>
              <CalculatorButton
                fullWidth
                variant="contained"
                onClick={() => handleNumberClick(num)}
              >
                {num}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="secondary"
              onClick={handleClear}
            >
              C
            </CalculatorButton>
          </Grid>
          {['+', '-', '*', '/'].map((op) => (
            <Grid item xs={3} key={op}>
              <CalculatorButton
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleOperatorClick(op)}
              >
                {op}
              </CalculatorButton>
            </Grid>
          ))}
          <Grid item xs={3}>
            <CalculatorButton
              fullWidth
              variant="contained"
              color="success"
              onClick={handleEqualsClick}
            >
              =
            </CalculatorButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;