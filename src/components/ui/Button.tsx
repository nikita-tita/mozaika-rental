import { TeamsButton, TeamsButtonProps } from './teams/TeamsButton'

export interface ButtonProps extends TeamsButtonProps {}

export function Button(props: ButtonProps) {
  return <TeamsButton {...props} />
} 