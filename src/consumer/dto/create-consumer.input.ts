import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class CreateConsumerInput {
    @Field(() => String)
    email : String
}