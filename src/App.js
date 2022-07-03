import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

const reducer = (state, {type, payload}) => {
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0') {
        return state
      }
      if(payload.digit === '.' && state.currentOperand.includes('.')) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.EVALUATE:
      if(
        state.operation == null || 
        state.previousOperand == null || 
        state.currentOperand == null
        ) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: null
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null){
        return state
      }
      if(state.currentOperand.length === 1){
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
  }
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) {
    return ""
  }
  let compute = ""
  switch(operation){
    case '÷':
      compute = prev / current;
      break;
    case '*':
      compute = prev * current;
      break;
    case '-':
      compute = prev - current;
      break;
    case '+':
      compute = prev + current;
      break;
  }
  return compute.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0})

const formatOperand = (operand) => {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if( decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{previousOperand, currentOperand, operation}, dispatch] = useReducer(reducer, {})
  return (
    <div className="App">
      <div className="navbar">
        <h4 className='navbar__title'>Calculator</h4>
      </div>
      <div className="calculator__container">
        <div className="output">
          <div className="previous__operand">{formatOperand(previousOperand)} {operation}</div>
          <div className="current__operand">{formatOperand(currentOperand)}</div>
        </div>
        <button className='span__two' onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch}/>
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2'dispatch={dispatch}/>
        <DigitButton digit='3' dispatch={dispatch}/>
        <OperationButton operation='*' dispatch={dispatch}/>
        <DigitButton digit='4' dispatch={dispatch}/>
        <DigitButton digit='5' dispatch={dispatch}/>
        <DigitButton digit='6' dispatch={dispatch}/>
        <OperationButton operation='-' dispatch={dispatch}/>
        <DigitButton digit='7' dispatch={dispatch}/>
        <DigitButton digit='8' dispatch={dispatch}/>
        <DigitButton digit='9' dispatch={dispatch}/>
        <OperationButton operation='+' dispatch={dispatch}/>
        <DigitButton digit='.' dispatch={dispatch}/>
        <DigitButton digit='0' dispatch={dispatch}/>
        <button className='span__two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
      </div>
      <footer className='footer'>a project by <a className='footer__link' href="https://suhaib-p.web.app/" target='_blank'>suhaib-p</a></footer>
    </div>
  );
}

export default App;
