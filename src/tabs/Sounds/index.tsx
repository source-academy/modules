import React from 'react';

type State = {};
type Props = {};

class Test extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  public render() {
    return <div>
        <p id= 'sound-default-text'>
          The sound tab gives you control over your custom sounds. You can play, pause, adjust the volume and download your sounds.
        <br />
		<br />
		  
        <audio controls src = '' id = 'sound-tab-player' style={{width: '100%'}}>
		<track src='' kind='captions' />
		</audio>
          <br />
        </p>      
      </div>;
  }
}

export default {
  toSpawn: () => true,
  body: () => <Test />,
  label: 'Test Tab',
  iconName: 'build',
};
