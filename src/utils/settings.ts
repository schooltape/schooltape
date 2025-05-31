export class Setting {
  constructor(
    public name: string,
    public description?: string,
  ) {
    this.name = name;
    this.description = description;
  }
}

export class Toggle extends Setting {
  constructor(
    name: string,
    public toggled: boolean,
    description?: string,
  ) {
    super(name, description);
    this.toggled = toggled;
  }

  toggle() {
    this.toggled = !this.toggled;
  }
}

export class Slider extends Setting {
  constructor(
    name: string,
    public min: number,
    public max: number,
    private value: number,
    description?: string,
  ) {
    super(name, description);
    this.min = min;
    this.max = max;
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  setValue(value: number) {
    if (this.min <= value && value <= this.max) {
      this.value = value;
    }
  }
}
