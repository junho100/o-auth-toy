import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { GithubCodeDto } from './dto/github-code.dto';
import { GithubUserTypes } from './type/github-user.type';

@Injectable()
export class AppService {
  constructor(private readonly httpservice: HttpService) {}
  public async getGithubInfo(
    githubCodeDto: GithubCodeDto,
  ): Promise<GithubUserTypes> {
    const axios = this.httpservice.axiosRef;
    const { code } = githubCodeDto;

    const getTokenUrl = 'https://github.com/login/oauth/access_token';

    const request = {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    };

    const response: AxiosResponse = await axios.post(getTokenUrl, request, {
      headers: {
        accept: 'application/json', // json으로 반환을 요청합니다.
      },
    });

    const { access_token } = response.data;

    const getUserUrl = 'https://api.github.com/user';

    const { data } = await axios.get(getUserUrl, {
      headers: {
        Authorization: `token ${access_token}`,
      },
    });

    const { login, avatar_url, name, bio, company } = data;

    const githubInfo: GithubUserTypes = {
      githubId: login,
      avatar: avatar_url,
      name,
      description: bio,
      location: company,
    };

    return githubInfo;
  }
}
