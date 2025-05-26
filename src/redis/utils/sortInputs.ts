import { IInput } from '../../db/db';

const sortInputs = (inputs: IInput[]) => {
  return inputs.sort(compare)
}

const compare = (a: IInput, b: IInput) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

export default sortInputs