import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { $Enums, Provider, Role } from "@prisma/client";

@ObjectType()
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  nickname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => Provider)
  provider: Provider;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];

  @Field({ nullable: true })
  token?: string;
}

registerEnumType(Provider, {
  name: 'Providers',
});

registerEnumType(Role, {
  name: 'Roles',
});