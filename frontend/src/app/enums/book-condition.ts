export enum BookCondition {
    Unused = 'unused',
    Very_Good = 'very_good',
    Good = 'good',
}

export const OptionCondition = [
    { value: BookCondition.Unused, label: 'Neuf' },
    { value: BookCondition.Very_Good, label: 'Très bon état' },
  { value: BookCondition.Good, label: 'Bon état' },
]

export const ConditionLabels: Record<BookCondition, string> = {
  [BookCondition.Unused]: 'Neuf',
  [BookCondition.Very_Good]: 'Très bon état',
  [BookCondition.Good]: 'Bon état',
};
