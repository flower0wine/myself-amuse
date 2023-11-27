package lift;

import java.util.ArrayList;

/**
 * 储存楼层的集合类
 * @author flowerwine
 * @date 2023 年 11 月 25 日
 */
public class LayerList extends ArrayList<Layer> {
    private static volatile LayerList layerList;

    private LayerList(int maxLayerNumber, LayerRequest layerRequest) {
        super(maxLayerNumber);
        for (int index = 0; index < maxLayerNumber; index++) {
            super.add(index, new Layer(layerRequest, index));
        }
    }

    /**
     * 获取单例的楼层集合对象
     * @return 返回生成的楼层集合对象
     */
    static LayerList singleInstance(int maxLayerNumber, LayerRequest layerRequest) {
        if(layerList == null) {
            synchronized (LayerList.class) {
                if(layerList == null) {
                    layerList = new LayerList(maxLayerNumber, layerRequest);
                }
            }
        }
        return layerList;
    }

    /**
     * 获取第一个元素
     * @return 返回第一个元素
     */
    Layer getFirst() {
        return this.get(0);
    }

}
