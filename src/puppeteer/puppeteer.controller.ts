import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PuppeteerService } from './puppeteer.service';
import { CreatePuppeteerDto } from './dto/create-puppeteer.dto';
import { UpdatePuppeteerDto } from './dto/update-puppeteer.dto';

@Controller('puppeteer')
export class PuppeteerController {
  constructor(private readonly puppeteerService: PuppeteerService) {}

  @Post()
  create(@Body() createPuppeteerDto: CreatePuppeteerDto) {
    return this.puppeteerService.create(createPuppeteerDto);
  }

  @Get()
  findAll() {
    return this.puppeteerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puppeteerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePuppeteerDto: UpdatePuppeteerDto) {
    return this.puppeteerService.update(+id, updatePuppeteerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puppeteerService.remove(+id);
  }
}
