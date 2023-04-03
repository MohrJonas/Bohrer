import { IPathCircle } from "makerjs";

export default class Layer {

	public paths: Array<IPathCircle> = [];

	constructor(public index: number, public color: string) {}

}