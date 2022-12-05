<template>
  <v-main>
    <Toolbar title="澳门六合彩" />
    <!-- <v-app-bar color="primary" dark app>
      <v-spacer></v-spacer>
      <v-app-bar-title></v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar> -->
    <v-container>
      <div class="rules content">
        <div class="header flex-c-c">
          <div class="icon-bg arrow-left"></div>
          <div class="h-left flex-c"></div>
          <div class="flex-c-c">
            <h3 class="header-title">
              澳门六合彩
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAAARklEQVRIDWNgGAWjITAaAiMgBP7//68NxH+BGB2AxLSpEgRAgxrQTQeJUcVwmCFollDXcCRLyoAWlcH4o/RoCIyGwEgJAQC81Ur3rSzREAAAAABJRU5ErkJggg=="
                alt=""
                class="triangle"
              />
            </h3>
          </div>
          <div class="head-right flex-c"><!----></div>
        </div>
        <div class="rules-item">
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
            ></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(一)以下所有投注皆含本金。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(二)</span
            ><span style="color: rgb(255, 0, 0)"
              ><strong
                ><span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >两面</span
                ></strong
              ></span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（指大、小、单、双)。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(三)<span style="color: rgb(255, 0, 0)"
                ><strong>特码：</strong></span
              >&nbsp;当期开出的最后一号码为特别号码（称特码）；<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />大小：&nbsp;开出之特码大于或等于25为特码大，小于或等于24为特码小，49为和；<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />单双：&nbsp;特码为偶数叫特双，为奇数叫特单，49为和；<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />波色：&nbsp;指开出之特码所属的颜色。<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />合数单双：&nbsp;合单：指开出特码的个位数加上十位数之和为奇数；合双：指开出特码的个位数加上十位数之和为偶数；号码49为和局。<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />如特码为25，则特码为大，为单，为蓝波，为合单；如特码为2，则特码为小，为双，为红波，为合双；特码为49时，则大小单双为和，合数单双为和，波色为绿波。<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />特码尾数大小：&nbsp;特尾小：开出之特码尾数（0-4），特尾大：开出之特码尾数（5-9）,49号为和局。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(四)<span style="color: rgb(255, 0, 0)"
                ><strong>正码</strong>：</span
              >&nbsp;当期开出之前6个号码叫正码。
              第一时间出来的叫正码1，依次叫正码2、正码3……正码6，不以大小排序。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(五)<span style="color: rgb(255, 0, 0)"
                ><strong>总</strong><strong>分大小</strong>：</span
              >&nbsp;所有七个开奖号码的分数总和大于或等于175为总分大；分数总和小于或等于174为总分小。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >如开奖号码为01、07、15、29、38、46、24，分数总和是160，则总分小。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >总分单双：&nbsp;所有七个开奖号码的分数总和是单数叫(总分单)，如分数总和是103、193；分数总和是双数叫(总分双)，如分数总和是108、160</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(六)<span style="color: rgb(255, 0, 0)"
                ><strong>正码1-6特</strong>：</span
              >&nbsp;正1特、正2特、正3特、正4特、正5特、正6特:指下注的正码特与开出之正码其开奖顺序及开奖号码相同，视为中奖，</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >如第一个正码开奖为13号，下注第一个正码特为13则视为中奖，其它号码视为不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(七)<span style="color: rgb(255, 0, 0)"
                ><strong>正码1-6</strong>：</span
              >&nbsp;正码1、正码2、正码3、正码4、正码5、正码6的大小单双、波色、合数单双和特别号码的大小单双、波色、合数单双规则相同，</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >如正码1为25，则正码1为大，为单，为蓝波；正码2为2，则正码2为小，</span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >为双，为红波；号码为49时，则大小单双、合数单双为和，波色为绿。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(八)<span style="color: rgb(255, 0, 0)"
                ><strong>波色</strong>：</span
              >&nbsp;指号码所属的颜色，<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              /><span style="color: rgb(255, 0, 0)"
                >红波包括： 01, 02, 07, 08, 12, 13, 18, 19, 23, 24, 29, 30, 34,
                35, 40, 45, 46</span
              ><br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              /><span style="color: rgb(0, 176, 240)"
                >蓝波包括： 03, 04, 09, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41,
                42, 47, 48</span
              ><br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              /><span style="color: rgb(0, 176, 80)"
                >绿波包括： 05, 06, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39,
                43, 44, 49</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(九)<span style="color: rgb(255, 0, 0)"
                ><strong>半波</strong>：</span
              >&nbsp;以特码色波和特码单双大小为一个投注组合，当开出特码符合投注组合，即视为中奖。若开出特码为49号时，所有投注半波任一个组合视为和局，其余情况视为不中奖</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十)<span style="color: rgb(255, 0, 0)"
                ><strong>特码生肖</strong><strong>:</strong></span
              >十二生肖中每一个生肖依序分别代表 49 个号码。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >例如今年是牛年，则由牛年为起始生肖，代表如下：</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >牛 01, 13, 25, 37, 49&nbsp;<br
                style="box-sizing: border-box"
              />鼠 02, 14, 26, 38&nbsp;<br style="box-sizing: border-box" />猪
              03, 15, 27, 39&nbsp;<br style="box-sizing: border-box" />狗 04,
              16, 28, 40&nbsp;</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >鸡 05, 17, 29, 41</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >猴 06, 18, 30, 40</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >羊 07, 19, 31, 43</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >马 08, 20, 32, 44</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >蛇 09, 21, 33, 45</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >龙 10, 22, 34, 46</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >兔 11, 23, 35, 47</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >虎 12, 24, 36, 48</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >当期特码开在您投注的生肖所属的号码中，则视为中奖，
              其他情形为不中奖 。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十一)</span
            ><span style="color: rgb(255, 0, 0)"
              ><strong
                ><span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >尾数</span
                ></strong
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >：</span
              ></span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >&nbsp;指7个开奖号码中含有所属尾数的一个或多个号码，不论同尾数的号码出现一个或多个，派彩只派一次。</span
            ><br />
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >例如：开奖结果正码是11、31、42、44、35、32特别号码是 21
              则"1"尾"2"尾"4"尾"5"尾都为中奖，其他尾数都不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >1尾包括：01,11,21,31,41<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />2尾包括：02,12,22,32,42<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />3尾包括：03,13,23,33,43<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />4尾包括：04,14,24,34,44<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />5尾包括：05,15,25,35,45<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />6尾包括：06,16,26,36,46<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />7尾包括：07,17,27,37,47<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />8尾包括：08,18,28,38,48<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />9尾包括：09,19,29,39,49<br
                style="
                  font-family: Arial, Tahoma, 'lucida grande', sans-serif;
                  background-color: rgb(240, 244, 253);
                "
              />0尾包括：10,20,30,40</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十二)<span style="color: rgb(255, 0, 0)"
                ><strong>合特肖</strong>：</span
              >&nbsp;挑选生肖为一投注组合，当期开出特码符合所选生肖及投注类别，即视为中奖。号码49为和局。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >二肖：挑选 2 个生肖为一投注组合进行下注。<br
            /></span>
          </p>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >三肖：挑选 3 个生肖为一投注组合进行下注。</span
            >
          </p>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >四肖：挑选 4 个生肖为一投注组合进行下注。</span
            >
          </p>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >五肖：挑选 5 个生肖为一投注组合进行下注。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >六肖：挑选 6 个生肖为一投注组合进行下注。<br
            /></span>
          </p>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >七肖：挑选 7 个生肖为一投注组合进行下注。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十三)<span style="color: rgb(255, 0, 0)"
                ><strong>一肖/生肖</strong>：</span
              >&nbsp;指开出的7个开奖号码中含有投注所属生肖的一个或多个号码，即视为中奖，不论同生肖的号码出现一个或多个，派彩只派一次。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >例如今年是牛年，则由牛年为起始生肖，代表如下：<br
                style="box-sizing: border-box"
              />牛 01, 13, 25, 37, 49</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >鼠 02, 14, 26, 38&nbsp;&nbsp;</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >猪 03, 15, 27, 39&nbsp;<br style="box-sizing: border-box" />狗
              04, 16, 28, 40&nbsp;</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >鸡 05, 17, 29, 41</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >猴 06, 18, 30, 42</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >羊 07, 19, 31, 43</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >马 08, 20, 32, 44</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >蛇 09, 21, 33, 45&nbsp;</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >龙 10, 22, 34, 46</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >兔 11, 23, 35, 47</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >虎 12, 24, 36, 48</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十四)<strong
                ><span style="color: rgb(255, 0, 0)">连码:</span></strong
              ></span
            ><br />
          </p>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >1.三全中</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >选择投注号码每三个号码为一组〈号码需三个号或以上，少于三个号码不成立〉，对奖号是以正码对奖〈1～6号不含特码〉，如三个号码都是在开奖号码的正码里，视为中奖，其他情形视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >2.</span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >四全中</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >选择投注号码每四个号码为一组〈号码需四个号或以上，少于四个号码不成立〉，对奖号是以正码对奖〈1～6号不含特码〉，如三个号码都是在开奖号码的正码里，视为中奖，其他情形视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >3.三中二 (中2/中3)</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >中二：选择投注号码每三个号码为一组〈号码需三个号或以上，少于三个号码不成立〉，如中的二个号码都是在开奖号码的正码里，为三中二视为中奖。</span
                >
              </p>
            </li>
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >中三：选择投注号码每三个号码为一组〈号码需三个号或以上，少于三个号码不成立〉，如中的三个号码都是在开奖号码的正码里，为三中二之中三视为中奖。</span
                >
              </p>
            </li>
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >除中二、中三外其他情形视为不中奖。</span
                >
              </p>
            </li>
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >例：11，17，18 为一组投注号码，开奖号码中有11，17
                  两个正码〈没有18号码〉，为三中二中奖，赔率为三中二的赔率，如果11，
                  17
                  ，18三个号码都是开奖之正码，视为三中二之中三，赔率为三中二之中三的赔率，</span
                >
              </p>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >如只中一个号或是没中任何号码，此情形视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >4.二全中</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >选择投注号码每二个号码为一组〈号码需二个号或以上，少于二个号码不成立〉，如二个号码都是在开奖号码的正码，视为中奖，其他情形视为不中奖。</span
                >
              </p>
            </li>
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >例：11， 17
                  二个号码都是开在正码里，视为中奖，如果二个号码一个中在正码一个中特码，此情形视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
            ></span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >5.二中特(中2中特)</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >选择投注号码每二个号码为一组〈号码需二个号或以上，少于二个号码不成立〉，如二个号码都是在开奖号码的正码，为二中特之中二，如果一个中在正码一个中特码为二中特之中特是视为中奖，其他情形视为不中奖。</span
                >
              </p>
            </li>
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >例：11， 17
                  二个号码都是开在正码里，视为中奖，如果二个号码一个中在正码一个中特码，为二中特之中特是视为中奖，其他情形视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p>
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
            ></span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >6.</span
            ><span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >&nbsp;特串</span
            >
          </p>
          <ul
            class="rulelist1 list-paddingleft-2"
            style="list-style-type: circle"
          >
            <li>
              <p>
                <span
                  style="
                    font-family: 宋体;
                    font-size: 13px;
                    letter-spacing: 1px;
                  "
                  >选择投注号码每二个号码为一组〈号码需二个号或以上，少于二个号码不成立〉，如二个号码其中一个开在正码，另一个开在特码，视为中奖，其他情形视为不中奖。如两个号码都开在正码里视为不中奖。</span
                >
              </p>
            </li>
          </ul>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（十五）<span style="color: rgb(255, 0, 0)"
                ><strong>不中</strong>：</span
              >&nbsp;每个号码都有自己的赔率，下注组合的总赔率，取该组合号码的最低赔率为总赔率。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >1. 五不中：
              挑选5个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >2. 六不中：
              挑选6个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >3. 七不中：
              挑选7个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >4. 八不中：
              挑选8个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >5. 九不中：
              挑选9个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >6. 十不中：
              挑选10个号码为一投注组合进行下注。当期开出的7个开奖号码都没有在该下注组合中，即视为中奖；其余情形视为不中奖</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（十六)<span style="color: rgb(255, 0, 0)"
                ><strong>生肖连</strong>：</span
              >&nbsp;（生肖所对应的号码和特码生肖项目的一样；一个生肖对应多个号码，不论同生肖的号码出现一个或多个，派彩只派一次。每个生肖都有自己的赔率，下注组合的总赔率，取该组合生肖的最低赔率为总赔率。）</span
            >
          </p>
          <table width="100%" class="subTable">
            <tbody>
              <tr class="firstRow">
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >1.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >二肖连（ 中
                    ）：&nbsp;选择二个生肖为一投注组合进行下注。该注的二个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >2.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >二肖连（不中）：&nbsp;选择二个生肖为一投注组合进行下注。该注的二个生肖必须没在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >3.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >三肖连（ 中
                    ）：&nbsp;选择三个生肖为一投注组合进行下注。该注的三个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >4.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >三肖连（不中）：&nbsp;选择三个生肖为一投注组合进行下注。该注的三个生肖必须没在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >5.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >四肖连（ 中
                    ）：&nbsp;选择四个生肖为一投注组合进行下注。该注的四个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >6.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >四肖连（不中）：&nbsp;选择四个生肖为一投注组合进行下注。该注的四个生肖必须没在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >7.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >五肖连（ 中
                    ）：&nbsp;选择五个生肖为一投注组合进行下注。该注的五个生肖必须在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >8.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >五肖连（不中）：&nbsp;选择五个生肖为一投注组合进行下注。该注的五个生肖必须没在当期开出的7个开奖号码相对应的生肖中，视为中奖。</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >(十七)<span style="color: rgb(255, 0, 0)"
                ><strong>尾</strong><strong>数连</strong>：</span
              >&nbsp;（尾数所对应的号码和尾数项目的一样；一个尾数对应多个号码，不论同尾数的号码出现一个或多个，派彩只派一次。每个尾数都有自己的赔率，下注组合的总赔率，取该组合尾数的最低赔率为总赔率。）</span
            >
          </p>
          <table width="100%" class="subTable">
            <tbody>
              <tr class="firstRow">
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >1.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >二尾连（ 中
                    ）：&nbsp;选择二个尾数为一投注组合进行下注。该注的二个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >2.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >二尾连（不中）：&nbsp;选择二个尾数为一投注组合进行下注。该注的二个尾数必须没在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >3.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >三尾连（ 中
                    ）：&nbsp;选择三个尾数为一投注组合进行下注。该注的三个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >4.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >三尾连（不中）：&nbsp;选择三个尾数为一投注组合<span
                      style="color: rgb(255, 0, 0)"
                    ></span
                    >进行下注。该注的三个尾数必须没在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >5.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >四尾连（ 中
                    ）：&nbsp;选择四个尾数为一投注组合进行下注。该注的四个尾数必须在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >6.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >四尾连（不中）：&nbsp;选择四个尾数为一投注组合进行下注。该注的四个尾数必须没在当期开出的7个开奖号码相对应的尾数中，视为中奖。</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（十八）<span style="color: rgb(255, 0, 0)"
                ><strong>一肖不中</strong>：</span
              >&nbsp;指开出的7个开奖号码中不含有投注所属生肖，即视为中奖</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（十九）<span style="color: rgb(255, 0, 0)"
                ><strong>尾数不中</strong>：</span
              >&nbsp;指开出的7个开奖号码中不含有投注所属尾数，即视为中奖。</span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              >（二十）<span style="color: rgb(255, 0, 0)"
                ><strong>中一</strong>：</span
              >&nbsp;每个号码都有自己的赔率，下注组合的总赔率，取该组合号码的最低赔率为总赔率。</span
            >
          </p>
          <table width="100%" class="subTable">
            <tbody>
              <tr class="firstRow">
                <td
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >1.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >四中一：&nbsp;挑选4个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >2.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >五中一：&nbsp;挑选5个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >3.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >六中一：&nbsp;挑选6个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >4.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >七中一：&nbsp;挑选7个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >5.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >八中一：&nbsp;挑选8个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >6.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >九中一：&nbsp;挑选9个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
              <tr>
                <td
                  class="num"
                  width="26"
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                    background-color: rgb(198, 231, 247);
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >7.</span
                  >
                </td>
                <td
                  style="
                    padding: 2px 0px;
                    border-color: rgb(47, 110, 143);
                    margin: 0px;
                  "
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                    "
                    >十中一：&nbsp;挑选10个号码为一投注组合进行下注。当期开出的7个开奖号码只有1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。例如：没有一个号码在组合中，或者是有两个及两个以上号码在组合中，都视为不中奖．</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <p style="white-space: normal">
            <span
              style="
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
                background-color: rgb(255, 255, 255);
              "
              ><br
            /></span>
          </p>
          <p style="white-space: normal">
            <span
              style="
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
                background-color: rgb(255, 255, 255);
              "
              >(二十一)<span style="color: rgb(255, 0, 0)"
                ><strong>特平中</strong></span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >1.挑选1个号码为一投注组合进行下注。当期开出的7个开奖号码有任何1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。<br /></span
            ></span>
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >2.挑选2个号码为一投注组合进行下注。当期开出的7个开奖号码有任何1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >3.挑选3个号码为一投注组合进行下注。当期开出的7个开奖号码有任何1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >4.挑选4个号码为一投注组合进行下注。当期开出的7个开奖号码有任何1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >5.挑选5个号码为一投注组合进行下注。当期开出的7个开奖号码有任何1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >6</span
              ></span
            ><span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              >.<span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >挑选6个号码为一投注组合进行下注。当期开出的7个开奖号码有</span
              ><span style="letter-spacing: 1px">任何</span
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >1个号码在该下注组合中，即视为中奖；其余情形视为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ></span
            ></span>
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                ><span
                  style="
                    font-family: consolas, 'lucida console', 'courier new',
                      monospace;
                    font-size: 12px;
                  "
                  ><br /></span></span
            ></span>
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                ><span
                  style="
                    font-family: consolas, 'lucida console', 'courier new',
                      monospace;
                    font-size: 12px;
                  "
                  >(二十二)<strong style="color: rgb(255, 0, 0)"
                    >生肖量/尾数量</strong
                  ></span
                ></span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                ><span
                  style="
                    font-family: consolas, 'lucida console', 'courier new',
                      monospace;
                    font-size: 12px;
                  "
                  >1.生肖量</span
                ></span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                ><span
                  style="
                    font-family: consolas, 'lucida console', 'courier new',
                      monospace;
                    font-size: 12px;
                  "
                ></span></span
            ></span>
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >估猜开出的七个开奖号码中所属的不同生肖的总个数，例如︰投注【肖5】，若该期开出的七个号码中所属的不同生肖总个数为5，即视为中奖，若七个号码中所属的不同生肖</span
              ></span
            ><span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >的总个数大于5或小于5则为不中奖。</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >2.尾数量</span
              ></span
            >
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
              ></span></span
            ><span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                >估猜开出的七个开奖号码中所对应的不同尾数的总个数，例如︰投注【尾5】，若该期开出的七个号码的不同尾数总个数为5，即视为中奖，若七个号码中的不同尾数的总个数大于5或小于5则为不中奖</span
              ></span
            >。
          </p>
          <p style="white-space: normal">
            <span
              style="
                background-color: rgb(255, 255, 255);
                color: rgb(32, 33, 36);
                font-family: consolas, 'lucida console', 'courier new',
                  monospace;
                font-size: 12px;
                white-space: pre-wrap;
              "
              ><span
                style="font-family: 宋体; font-size: 13px; letter-spacing: 1px"
                ><br /></span></span
            ><br />
          </p>
          <table
            width="96%"
            align="center"
            cellpadding="2"
            cellspacing="1"
            class="content"
          >
            <tbody>
              <tr class="firstRow">
                <td
                  class="BigNum"
                  width="43"
                  style="padding: 2px 0px; margin: 0px; vertical-align: top"
                >
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                      color: rgb(255, 0, 0);
                    "
                    >注：</span
                  >
                </td>
                <td valign="top" style="padding: 2px 0px; margin: 0px">
                  <span
                    style="
                      font-family: 宋体;
                      font-size: 13px;
                      letter-spacing: 1px;
                      color: rgb(255, 0, 0);
                    "
                    >胆拖(1胆/2胆)：&nbsp;是一种快速下注模式,即选择好固定号码，再选择其他号码与其组合进行下注。如三中二之8、18拖19、20、21，即是三组：8-18-19、8-18-20、8-18-21<br />复式：&nbsp;是一种快速下注模式，即选择多个号码（生肖、尾数）进行排列组合进行下注。[应用于连码、五不中、生肖连、尾数连等项目]<br />生肖对碰：&nbsp;是一种简易下注模式，生肖都相对应号码，选择两个生肖对碰下注，相应是选择多个号码组合成不重复组合进行下注。[应用于连码等项目]<br />尾数对碰：&nbsp;是一种简易下注模式，尾数都相对应号码，选择两个尾数对碰下注，相应是选择多个号码组合成不重复组合进行下注。[应用于连码等项目]<br />肖尾对碰：&nbsp;是一种简易下注模式，生肖和尾数都相对应号码，选择生肖尾数对碰下注，相应是选择多个号码组合成不重复组合进行下注。[应用于连码等项目]<br /><br
                  /></span>
                </td>
              </tr>
            </tbody>
          </table>
          <p><br style="white-space: normal" /></p>
          <p><br /></p>
        </div>
        <!---->
      </div>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "PageRules",
  layout: "blank",
};
</script>

<style></style>
