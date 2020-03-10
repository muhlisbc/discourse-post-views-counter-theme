import { withPluginApi } from "discourse/lib/plugin-api";
import { h } from "virtual-dom";
import { iconNode } from "discourse-common/lib/icon-library";

function initWithApi(api) {
  api.reopenWidget("post-meta-data", {
    html(attrs) {
      const infos = this._super(...arguments);

      const postInfosIdx = infos.findIndex(i => {
        return i.properties && i.properties.className == "post-infos";
      });

      if (postInfosIdx < 0) return infos;

      const childs = infos[postInfosIdx].children || [];
      const postDateIdx = childs.findIndex(i => {
        return i.properties && i.properties.className == "post-info post-date";
      });

      if (postDateIdx < 0) return infos;

      const reads = attrs.reads || 0;
      const views = h(
        "div.post-views-counter",
        {
          title: I18n.t(themePrefix("views"), { num: reads })
        },
        [reads, iconNode("far-eye")]
      );

      childs.insertAt(postDateIdx, views);

      infos[postInfosIdx].children = childs;

      return infos;
    }
  });
}

export default {
  name: "post-views-counter-theme",

  initialize() {
    withPluginApi("0.8.7", initWithApi);
  }
};
