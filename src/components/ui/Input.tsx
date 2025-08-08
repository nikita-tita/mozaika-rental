import { TeamsInput, TeamsInputProps } from './teams/TeamsInput'

export interface InputProps extends TeamsInputProps {}

export function Input(props: InputProps) {
  return <TeamsInput {...props} />
} 