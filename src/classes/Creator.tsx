import Konva from "konva";

declare global {
    interface Window {asd: any;}
}

type SceneSize = {
    width: number,
    height: number
}

class Creator {

    private sceneSize: SceneSize = {
        width: 500,
        height: 500
    };

    private stage: Konva.Stage;
    private selectedLayer: Konva.Layer | undefined = undefined;
    private selectedElement: Konva.Node | Konva.Group | undefined = undefined;
    private uiUpdateInterface: Function;

    constructor(uiUpdateInterface: Function){
        this.stage = new Konva.Stage({
            container: 'container',
            width: this.sceneSize.width,
            height: this.sceneSize.height
        });
        this.uiUpdateInterface = uiUpdateInterface;
        this.createLayerIfNotExists();
        this.fitStageIntoParentContainer();
        window.asd = this.stage;
        this.stage.on('click', this.onClickStage);
        window.addEventListener('resize', this.fitStageIntoParentContainer);
    }

    public centerSelectedElementOnStage = (): void => {
        if(this.selectedElement && this.selectedElement.draggable()){
            this.selectedElement.rotation(0);
            this.selectedElement.x(
                this.sceneSize.width/2 - this.selectedElement.width()/2 * this.selectedElement.scaleX()
            );
            this.selectedElement.y(
                this.sceneSize.height/2 - this.selectedElement.height()/2 * this.selectedElement.scaleY()
            );
        }
    }

    public getLayers: Function = (): Array<Konva.Layer> => {
        return this.stage.getLayers();
    };

    private onClickStage: Konva.KonvaEventListener<any, any> = (event: Konva.KonvaEventObject<MouseEvent> ): void => {
        this.hideAllTransformers(event);
    }

    fitStageIntoParentContainer: any = (): void => {
        let containerWidth = this.stage.container().offsetWidth - 4;
        let scale = containerWidth / this.sceneSize.width;
        this.stage.width(this.sceneSize.width * scale);
        this.stage.height(this.sceneSize.height * scale);
        this.stage.scale({
            x: scale, y:scale
        });
    }

    public addImageLayer(src: any){
        return new Promise((resolve, reject) => {
            let imgHtml = new Image();
            imgHtml.onload = () => {
                let scale = this.getImageScaleForFitToStage(imgHtml);
                let group = this.getKonvaGroup();
                let image = new Konva.Image({
                    scaleX: scale,
                    scaleY: scale,
                    image: imgHtml,
                    draggable: true
                });
                let konvaTransformer = this.getKonvaTransformer(true);
                image.setAttr('src', src);
                image.setAttr('label', '');
                image.setAttr('clientPhoto', false);
                this.selectedElement = image;
                group.add(image);
                group.add(konvaTransformer);
                konvaTransformer.nodes([image]);
                this.selectedLayer?.add(group);
                group.moveToTop();
                this.addShapeOnClickEvent(image);
                this.hideNotSelectedTransformers();
                this.centerSelectedElementOnStage();
                resolve(true);
            }
            
            if(src)
                imgHtml.src = src;
        });

    }

    private getImageScaleForFitToStage = (imageHtml: HTMLImageElement): number => {
        if(imageHtml.width >= imageHtml.height)
            return (this.stage.width()/this.stage.scaleX()) / imageHtml.width;
        else
            return (this.stage.height()/this.stage.scaleY()) / imageHtml.height;
    }

    public fitSelectedElementToStage = (): void => {
        if(this.selectedElement && this.selectedElement.draggable()){
            if(this.selectedElement.width() >= this.selectedElement.height()){
                this.selectedElement.scaleX((this.stage.width()/this.stage.scaleX()) / this.selectedElement.width());
                this.selectedElement.scaleY((this.stage.width()/this.stage.scaleX()) / this.selectedElement.width());
            }else{
                this.selectedElement.scaleX((this.stage.height()/this.stage.scaleY()) / this.selectedElement.height());
                this.selectedElement.scaleY((this.stage.height()/this.stage.scaleY()) / this.selectedElement.height());
            }
            this.centerSelectedElementOnStage();
        }
    }

    public lockElement = (elementId: number | string): void => {
        let element: any = this.selectedLayer?.findOne(`#${elementId.toString()}`);
        if(element){
            let shapeChild = element.findOne('Shape');
            shapeChild.draggable(!shapeChild.draggable());
            let transformerChild = element.findOne('Transformer');
            transformerChild.resizeEnabled(!transformerChild.resizeEnabled());
            transformerChild.rotateEnabled(!transformerChild.rotateEnabled());
        }
    }

    public getSelectedElementParams = (): any => {
        let id = 0, width = 0, height = 0;
        if(this.selectedElement){
            id = +this.selectedElement.getParent().id();
            width = this.selectedElement.width() * this.selectedElement.scaleX();
            height = this.selectedElement.height() * this.selectedElement.scaleY();
        }
        return {
            id: id,
            width: width,
            height: height,
            x: this.selectedElement?.x(),
            y: this.selectedElement?.y(),
            rotation: this.selectedElement?.rotation(),
            draggable: this.selectedElement?.draggable(),
        }
    }

    public setSelectedElementX = (x: number): void => {
        if(this.selectedElement?.draggable())
            this.selectedElement?.x(x);
    }

    public setSelectedElementY = (y: number): void => {
        if(this.selectedElement?.draggable())
            this.selectedElement?.y(y);
    }

    public setSelectedElementWidth = (width: number): void => {
        if(this.selectedElement?.draggable())
            this.selectedElement?.width(width / this.selectedElement.scaleX());
    }

    public setSelectedElementHeight = (height: number): void => {
        if(this.selectedElement?.draggable())
            this.selectedElement?.height(height / this.selectedElement.scaleY());
    }

    public setSelectedElementRotation = (rotation: number): void => {
        if(this.selectedElement?.draggable())
            this.selectedElement?.rotation(rotation);
    }

    private createLayerIfNotExists(): void {
        if(!this.selectedLayer){
            let layer = new Konva.Layer({
                id: Math.floor(100000 + Math.random() * 900000).toString()
            });
            this.selectedLayer = layer;
            this.stage.add(layer);
        }
    }

    public addFrameRect(): void {
        let group = this.getKonvaGroup();
        let rectangle = new Konva.Rect({
            id: Math.floor(100000 + Math.random() * 900000).toString(),
            draggable: true,
            width: 200,
            height: 200,
            x: 50,
            y: 50,
            stroke: 'black',
            hitStrokeWidth: 1,
            strokeScaleEnabled: false,
            shadowEnabled: false,
        });
        rectangle.skewX(0);
        rectangle.setAttr('label', '');
        let konvaTransformer = this.getKonvaTransformer(false);
        this.selectedElement = rectangle;
        group.add(rectangle);
        group.add(konvaTransformer);
        konvaTransformer.nodes([rectangle]);
        this.selectedLayer?.add(group);
        group.moveToTop();
        this.addShapeOnClickEvent(rectangle);
        this.hideNotSelectedTransformers();
        this.centerSelectedElementOnStage();
    }

    public moveUpSelectedElement(): void {
        this.selectedElement?.getParent()?.moveUp();
    }

    public setElementLabel(elementId: number | string, label: string): void {
        let element = this.selectedLayer?.findOne(`#${elementId.toString()}`);
        if(element)
            element.setAttr('label', label);
    }

    public moveDownSelectedElement(): void {
        this.selectedElement?.getParent()?.moveDown();
    }

    public deleteSelectedElement(): void {
        this.selectedElement?.getParent()?.destroy();
        this.selectedElement = this.selectedLayer?.findOne('Shape');
        this.hideNotSelectedTransformers();
    }

    public getElementsList(): Array<object>{
        let childrenSortByZIndex: Array<any> = [];
        let layer: Konva.Layer = this.stage.findOne('Layer');
        if(layer){
            let children: Array<any> = layer.getChildren((node: any) => {
                return node.getClassName() === 'Group';
            });
            childrenSortByZIndex = new Array(children.length).fill(0);
            if(children){
                children.forEach((group) => {
                    let children = group.getChildren((node: any) => {
                        return node.getClassName() !== 'Transformer';
                    })
                    childrenSortByZIndex[group.zIndex()] = {
                        type: children[0].getClassName(),
                        id: group.id(),
                        draggable: children[0].draggable()
                    };
                });
            }
        }
        return childrenSortByZIndex.reverse();
    }

    private getKonvaTransformer(borderEnabled: boolean): Konva.Transformer {
        let konvaTransformer = new Konva.Transformer({
            id: `transformer`,
            borderEnabled: borderEnabled
        })
        return konvaTransformer;
    }

    private getKonvaGroup(): Konva.Group {
        return new Konva.Group({id: Math.floor(100000 + Math.random() * 900000).toString()});
    }

    private addShapeOnClickEvent(shape: Konva.Shape): void{
        shape.on(`click touchstart dragmove transform`, (event: Konva.KonvaEventObject<MouseEvent>): void => {
            this.selectedElement = event.target;
            this.hideNotSelectedTransformers();
            this.uiUpdateInterface();
            event.cancelBubble = true;
        })
    }

    private hideNotSelectedTransformers(): void {
        let groups = this.selectedLayer?.getChildren(node => {
            return node.getClassName() === 'Group';
        });
        groups?.forEach((group: any) => {
            let transformer = group.findOne(`Transformer`);
            transformer?.nodes()[0] !== this.selectedElement?transformer.visible(false):transformer.visible(true);
        })
    }

    private hideAllTransformers: Konva.KonvaEventListener<any, any> = (event: Konva.KonvaEventObject<MouseEvent> ): void => {
        if(event.target === this.stage){
            let groups = this.selectedLayer?.getChildren(node => {
                return node.getClassName() === 'Group';
            });
            groups?.forEach((group: any) => {
                group.findOne(`Transformer`)?.visible(false);
            })
        }
    }
}

export default Creator;