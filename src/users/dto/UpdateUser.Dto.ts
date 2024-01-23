import { IsEmail, IsUrl, Length, Min } from 'class-validator';

export class UpdateUserDto {
  @Length(1, 64)
  username: string;

  @Length(0, 200)
  about: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @Min(2)
  password: string;
}
