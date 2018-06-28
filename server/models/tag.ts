import * as AWS from "aws-sdk";

export interface ITag {
    key?: string;
    value?: string;
}

export class TagMapper {

    public static toModels(tags: AWS.EC2.Tag[]): ITag[] {
        return (tags || [])
            .map(TagMapper.toModel)
            .filter(TagMapper.isValid);
    }

    public static toModel(tag: AWS.EC2.Tag): ITag {
        return {
            key: tag.Key,
            value: tag.Value
        };
    }

    public static isValid(tag: ITag): boolean {
        return tag.key !== '' && tag.value !== '';
    }

    public static findName(tags: ITag[]): ITag | undefined {
        return tags.find(tag => tag.key === 'Name');
    }
}
