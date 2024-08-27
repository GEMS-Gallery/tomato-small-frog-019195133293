import React, { useState } from 'react';
import { Container, Paper, Grid, Button, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '2rem',
  padding: theme.spacing(2),
  backgroundColor: '#f0f0f0',
  color: '#333',
  border: '2px solid #999',
  borderRadius: '8px',
  boxShadow: '0 4px 0 #999',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  '&:active': {
    boxShadow: '0 2px 0 #999',
    transform: 'translateY(2px)',
  },
}));

const Display = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'right',
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  backgroundColor: '#a7d9a8',
  border: '4px solid #5a8c5a',
  borderRadius: '8px',
  fontFamily: '"VT323", monospace',
}));

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#c0c0c0',
  border: '4px solid #808080',
  borderRadius: '16px',
  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
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
      <CalculatorPaper elevation={3}>
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
              style={{ backgroundColor: '#ff6b6b', color: '#fff' }}
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
                style={{ backgroundColor: '#4ecdc4', color: '#fff' }}
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
              style={{ backgroundColor: '#45b7d1', color: '#fff' }}
              onClick={handleEqualsClick}
            >
              =
            </CalculatorButton>
          </Grid>
        </Grid>
      </CalculatorPaper>
    </Container>
  );
};

export default App;