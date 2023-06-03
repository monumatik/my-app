import * as React from 'react';
import Creator from '../../classes/Creator';
import './App.css';

class App extends React.PureComponent{

  private creator: Creator;

  state: any = {
    elements: [],
    selectedElementParams: {},
  };

  constructor(props: any){
    super(props);
    this.creator = new Creator(this.uiUpdate);
  }

  uiUpdate = (): void => {
    this.setState({
      selectedElementParams: this.creator.getSelectedElementParams(),
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

  onChangeElementLabel = (event: React.FormEvent<HTMLInputElement>): void => {
    let elementId = event.currentTarget.getAttribute('data-elementid');
    let value = event.currentTarget.value;
    if(elementId)
      this.creator.setElementLabel(
        elementId.toString(),
        value.toString()
      );
  }

  render(): React.ReactNode {
    return(
      <>
        <div className='flex flex-col'>
          <input 
            type='file' 
            accept='.png'
            onChange={this.onLoadFile}  
          ></input>
          <button 
            type='button'
            onClick={this.onClickRectFrameAdd}
            className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">
            Dodaj ramke
          </button>
          Właściwości obiektu:
          <p>Wysokość: { this.state.selectedElementParams?.width }</p>
          <p>Szerokość: { this.state.selectedElementParams?.height }</p>
        </div>
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
                  "px-4 py-1 text-sm text-purple-600 font-semibold border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2" : 
                  "px-4 py-1 text-sm text-purple-600 font-semibold"
                }`}>
                {element.type}-{element.id}-
                <input
                  data-elementid={element.id.toString()}
                  onChange={this.onChangeElementLabel}
                  className='text-sm text-purple-600 font-semibold border border-purple-200'
                  type='text'/>
              </div>
            );
          }) }
        </div>
      </>
    );
  }

}

export default App;
