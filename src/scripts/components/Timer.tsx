import * as React from 'react';
import styled from '@emotion/styled';
import {
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  subHours,
  subMinutes
} from 'date-fns';
import * as keycode from 'keycode';

import start from '../icons/start.svg';
import stop from '../icons/stop.svg';

const NO_DESCRIPTION = '(no description)';

/**
 * Returns the elapsed time since `since` as a duration in the format hh:mm:ss.
 */
export const formatDuration = (start: string | number, stop?: string | number) => {
  const now = stop || Date.now();
  const hours = differenceInHours(now, start);
  const minutes = differenceInMinutes(subHours(now, hours), start);
  const seconds = differenceInSeconds(subMinutes(subHours(now, hours), minutes), start);
  const timeValue = (value) => value > 9 ? value : (value > 0 ? '0' + value : '00');

  return `${timeValue(hours)}:${timeValue(minutes)}:${timeValue(seconds)}`;
}

type TimerProps = {
  entry: TimeEntry | null;
};

function Timer (props: TimerProps) {
  return props.entry
    ? <RunningTimer entry={props.entry} />
    : <TimerForm />
}

function RunningTimer(props: { entry: TimeEntry }) {
  const { entry } = props;
  const editEntry = (e) => {
    e.preventDefault();
    window.PopUp.updateEditForm(window.PopUp.$editView);
  };
  const stopTimer = (e) => {
    e.preventDefault();
    window.PopUp.sendMessage({ type: 'stop', service: 'dropdown', respond: true });
  };

  return (
    <TimerContainer>
      <TimerDescription title={`Click to edit ${entry.description || ''}`} onClick={editEntry} running>
        {entry.description || NO_DESCRIPTION}
      </TimerDescription>
      <TimerDuration start={entry.start} />
      <TimerButton isRunning onClick={stopTimer} />
    </TimerContainer>
  );
}

function TimerDuration ({ start }: { start: string }) {
  const [ duration, setDuration ] = React.useState(formatDuration(start));

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDuration(formatDuration(start));
    }, 1000);
    return () => clearTimeout(timeoutId);
  })

  return (
    <Duration>
      {duration}
    </Duration>
  )
}

function TimerForm () {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const startTimer = (e) => {
    e.preventDefault();
    const description = inputRef && inputRef.current
      ? inputRef.current.value
      : '';
    window.PopUp.sendMessage({ type: 'timeEntry', description, service: 'dropdown', respond: true });
  };
  const onKeyUp = (e) => {
    if (keycode(e.which) === 'enter') {
      startTimer(e);
    }
  }

  return (
    <TimerContainer>
      <TimerInput ref={inputRef} onKeyUp={onKeyUp} placeholder='What are you working on?' />
      <TimerButton isRunning={false} onClick={startTimer} />
    </TimerContainer>
  );
}

const TimerContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;

  box-shadow: rgb(232, 232, 232) 0px -1px 0px 0px inset;
  align-items: center;
  padding: .5rem .8rem;
  box-sizing: border-box;
  background: #fff;
  margin-bottom: 1rem;
  height: 50px;
`;

const TimerDescription = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  font-size: 14px;
  cursor: ${(props: { running?: boolean }) => props.running ? 'pointer' : 'initial'};
`;

const TimerInput = styled.input`
  flex: 1;
  height: 100%;
  padding-right: 1rem;
  border: none;

  font-size: 14px;

  &:hover, &:focus {
    outline: none;
  }
`;

const Duration = styled.div`
  padding: 0 .8rem;
`;


type TimerButtonProps = {
  isRunning: boolean;
};
const TimerButton = styled.div`
  display: inline-block;
  width: 24px;
  height: 24px;
  background: url(${(props: TimerButtonProps) => props.isRunning ? stop : start}) no-repeat;
  background-position: 55% 50%;
  background-size: 24px;
  border: none;
  cursor: pointer;
`;

export default Timer;
