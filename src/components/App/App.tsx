import * as React from 'react';
import Creator from '../../classes/Creator';
import './App.css';

class App extends React.PureComponent{

  private creator: Creator;

  state: any = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    elements: [],
    selectedElementParams: {},
  };

  constructor(props: any){
    super(props);
    this.creator = new Creator(this.uiUpdate);
  }

  uiUpdate = (): void => {
    let params = this.creator.getSelectedElementParams();
    this.setState({
      x: params.x,
      y: params.y,
      width: params.width,
      height: params.height,
      rotation: params.rotation,
      selectedElementParams: params,
      elements: this.creator.getElementsList()
    });
  }

  onLoadFile = (arg: any) => {
    let fileReader = new FileReader();
    fileReader.onload = async (arg) => {
      await this.creator.addImageLayer(arg.target?.result);
      this.uiUpdate();
    };
    if(arg.target.files.length)
      fileReader.readAsDataURL(arg.target?.files[0]);
  }

  onClickRectFrameAdd = (event: React.SyntheticEvent): void => {
    this.creator.addFrameRect();
    this.uiUpdate();
  }

  onClickMoveUp = (event: React.SyntheticEvent): void => {
    this.creator.moveUpSelectedElement();
    this.uiUpdate();
  }

  onClickMoveDown = (event: React.SyntheticEvent): void => {
    this.creator.moveDownSelectedElement();
    this.uiUpdate();
  }

  onClickDelete = (event: React.SyntheticEvent): void => {
    this.creator.deleteSelectedElement();
    this.uiUpdate();
  }

  onClickCenter = (event: React.SyntheticEvent): void => {
    this.creator.centerSelectedElementOnStage();
    this.uiUpdate();
  }

  onClickFitToStage = (event: React.SyntheticEvent): void => {
    this.creator.fitSelectedElementToStage();
    this.uiUpdate();
  }

  onChangeElementLabel = (event: React.FormEvent<HTMLInputElement>): void => {
    let elementId = event.currentTarget.getAttribute('data-elementid');
    let value = event.currentTarget.value;
    if(elementId)
      this.creator.setElementLabel(
        elementId.toString(),
        value.toString()
      );
  }

  onClickLockElement = (event: React.SyntheticEvent): void => {
    let elementId = event.currentTarget.getAttribute('data-elementid');
    if(elementId){
      this.creator.lockElement(
        elementId.toString()
      );
    }
    this.uiUpdate();
  }

  onXChange = (event: React.FormEvent<HTMLInputElement>): void => {
    debugger;
    let x = event.currentTarget.value;
    this.setState({
      x: x
    });
    this.creator.setSelectedElementX(Number(x));
    this.uiUpdate();
  }

  onWidthChange = (event: React.FormEvent<HTMLInputElement>): void => {
    debugger;
    let width = event.currentTarget.value;
    this.setState({
      width: width
    });
    this.creator.setSelectedElementWidth(Number(width));
    this.uiUpdate();
  }

  onHeightChange = (event: React.FormEvent<HTMLInputElement>): void => {
    debugger;
    let height = event.currentTarget.value;
    this.setState({
      height: height
    });
    this.creator.setSelectedElementHeight(Number(height));
    this.uiUpdate();
  }

  onRotationChange = (event: React.FormEvent<HTMLInputElement>): void => {
    debugger;
    let rotation = event.currentTarget.value;
    this.setState({
      rotation: rotation
    });
    this.creator.setSelectedElementRotation(Number(rotation));
    this.uiUpdate();
  }

  onYChange = (event: React.FormEvent<HTMLInputElement>): void => {
    let y = event.currentTarget.value;
    this.setState({
      y: y
    });
    this.creator.setSelectedElementY(Number(y));
    this.uiUpdate();
  }

  render(): React.ReactNode {
    return(
      <>
        <div className='flex flex-col'>
          <input 
            type='file' 
            
            onChange={this.onLoadFile}  
          ></input>
          <button 
            type='button'
            onClick={this.onClickRectFrameAdd}
            className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
            Dodaj ramke
          </button>
          Właściwości obiektu:
          <p>x: <input type='range' min='0' max='500' value={ this.state.x } onChange={this.onXChange}/></p>
          <p>y: <input type='range' min='0' max='500' value={ this.state.y } onChange={this.onYChange}/></p>
          <p>Wysokość: <input type='range' min='0' max='500' value={ this.state.width } onChange={this.onWidthChange}/></p>
          <p>Szerokość: <input type='range' min='0' max='500' value={ this.state.height } onChange={this.onHeightChange}/></p>
          <p>rotacja: <input type='range' min='-179' max='180' value={ this.state.rotation } onChange={this.onRotationChange}/></p>
        </div>
        <button 
          type='button'
          onClick={this.onClickCenter}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
          Wyśrodkuj
        </button>
        <button 
          type='button'
          onClick={this.onClickFitToStage}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
          Dopasuj do sceny
        </button>
        <button 
          type='button'
          onClick={this.onClickMoveUp}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
          Przesuń wyzej
        </button>
        <button 
          type='button'
          onClick={this.onClickMoveDown}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
          Przesuń nizej
        </button>
        <button 
          type='button'
          onClick={this.onClickDelete}
          className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
          Usuń
        </button>
        <br/>
        <br/>
        <div className='flex flex-col'>
          Lista obiektów:
          { this.state.elements?.map((element: any) => {
            return(
              <div
                className={`${
                  this.state.selectedElementParams.id == element.id ?
                  "px-4 py-1 text-sm text-purple-600 font-semibold border border-purple-200" : 
                  "px-4 py-1 text-sm text-purple-600 font-semibold"
                }`}>
                {element.type}-{element.id}-
                <input
                  data-elementid={element.id.toString()}
                  onChange={this.onChangeElementLabel}
                  className='text-sm text-purple-600 font-semibold border border-purple-200'
                  type='text'
                  />
                  -
                <button
                  data-elementid={element.id.toString()}
                  className='focus:outline-none focus:ring focus:ring-violet-300'
                  type='button'
                  onClick={this.onClickLockElement}
                  >
                  { element.draggable === true ? 'Zablokuj' : 'Odblokuj' }  
                  </button>
              </div>
            );
          }) }
        </div>
      </>
    );
  }

}

export default App;
