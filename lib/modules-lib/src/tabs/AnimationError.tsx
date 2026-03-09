import { Icon } from '@blueprintjs/core';

export interface AnimationErrorProps {
  error: Error;
}

/**
 * React component for displaying errors related to animations
 * @category Components
 */
export default function AnimationError({ error }: AnimationErrorProps) {
  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <Icon icon='warning-sign' size={90} />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <h3>An error occurred while running your animation!</h3>
        <p style={{ justifySelf: 'flex-end' }}>Here&apos;s the details:</p>
      </div>
    </div>
    <code style={{
      color: 'red'
    }}>
      {error.toString()}
    </code>
  </div>;
}
