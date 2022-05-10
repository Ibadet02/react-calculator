import React, { useReducer } from 'react';
import DigitButton from './components/DigitButton';
import OperationButton from './components/OperationButton';
import './app.scss';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPEATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

const reducer = (state, {type, payload}) =>{
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overWrite)
        return {
          ...state,
          overWrite: false,
          currentOperation: payload.digit
        }
      if(payload.digit == '0' && state.currentOperation == '0')
        return state
      if(payload.digit == '.' && state.currentOperation.includes('.'))
        return state
      return {
        ...state,
        currentOperation: `${state.currentOperation == '0' ? "" : state.currentOperation || ""}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPEATION:
      if(state.currentOperation == 'Error' || state.currentOperation == 'Infinity')
        return state
      if(state.previousOperation == '')
        return {
          ...state,
          previousOperation: `${state.currentOperation}`,
          currentOperation: '0',
          operation: payload.operation
        }
      if(state.currentOperation == '')
        return {
          ...state,
          currentOperation: '0',
          operation: payload.operation
        }
      if(evaluate(state) == 'NaN' || evaluate(state) == 'Infinity')
        return {
          ...state,
          previousOperation: '',
          operation: '',
          currentOperation: evaluate(state) == 'NaN' ? 'Error' : evaluate(state),
          overWrite: true
        }
      return {
        ...state,
        previousOperation: evaluate(state),
        currentOperation: '0',
        operation: payload.operation
      }
    case ACTIONS.CLEAR:
      return {
        ...state,
        currentOperation: '0',
        previousOperation: '',
        operation: ''
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.currentOperation == 'Error' || state.currentOperation == 'Infinity')
        return {
          ...state,
          currentOperation: '0'
        }
      return {
        ...state,
        currentOperation: state.currentOperation == '0' ? state.currentOperation : state.currentOperation.length != 1 ? state.currentOperation.slice(0,-1) : '0'
      }
    case ACTIONS.EVALUATE:
      if(state.previousOperation == '' || state.currentOperation == '' || state.operation == '')
        return {...state}
      return {
        ...state,
        overWrite: true,
        currentOperation: evaluate(state) == 'NaN' ? 'Error' : evaluate(state),
        previousOperation: '',
        operation: ''
      }
  }
}

const evaluate = ({currentOperation, previousOperation, operation}) =>{
  const current = parseFloat(currentOperation)
  const prev = parseFloat(previousOperation)
  if(isNaN(current) || isNaN(prev)) return ''
  let computation=''
  switch(operation){
    case '+':
      computation = prev + current
      break
    case '-':
      computation = prev - current
      break
    case '*':
      computation = prev * current
      break
    case '÷':
      computation = prev / current
      break
  }
  return computation.toString()
}

// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
//   maximumFractionDigits: '0'
// })

// const formatNumber = (number) =>{
//   console.log(number)
//   if(number == '') return
//   const [integer, decimal] = number.split('.')
//   if(decimal == '') return INTEGER_FORMATTER.format(integer)
// }

function App() {
  const [{currentOperation, previousOperation, operation}, dispatch] = useReducer(reducer, {currentOperation: '0',previousOperation: '',operation: ''})

  return (
    <div className="App">
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previous-operation'>{previousOperation} {operation}</div>
          <div className='current-operation'>{currentOperation}</div>
        </div>
        <button onClick={() => dispatch({type: ACTIONS.CLEAR})} className='span-two'>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation='÷' dispatch={dispatch} />
        <DigitButton digit={'1'} dispatch={dispatch} />
        <DigitButton digit={'2'} dispatch={dispatch} />
        <DigitButton digit={'3'} dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit={'4'} dispatch={dispatch} />
        <DigitButton digit={'5'} dispatch={dispatch} />
        <DigitButton digit={'6'} dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButton digit={'7'} dispatch={dispatch} />
        <DigitButton digit={'8'} dispatch={dispatch} />
        <DigitButton digit={'9'} dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <DigitButton digit={'.'} dispatch={dispatch} />
        <DigitButton digit={'0'} dispatch={dispatch} />
        <button onClick={() => dispatch({type: ACTIONS.EVALUATE})} className='span-two'>=</button>
      </div>
    </div>
  );
}

export default App;