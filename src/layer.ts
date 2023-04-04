import { IPathCircle } from "makerjs";

export default class Layer {

    public paths: Array<IPathCircle> = [];

    constructor(public color: tinycolorInstance) {}

}