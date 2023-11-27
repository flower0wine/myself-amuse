package lift;

/**
 * 楼层, 储存楼层的基本信息
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */
class Layer {
    private final LayerRequest layerRequest;
    private final Integer layerNumber;

    Layer(LayerRequest layerRequest, Integer layerNumber) {
        this.layerRequest = layerRequest;
        this.layerNumber = layerNumber;
    }

    /**
     * 请求召唤上升的电梯, 比如在电梯门外按下了上升按钮
     */
    void requestUpLift() {
        layerRequest.addLayer(this, MoveDirection.UP);
    }

    /**
     * 请求召唤下降的电梯, 比如在电梯门外按下了下降按钮
     */
    void requestDownLift() {
        layerRequest.addLayer(this, MoveDirection.DOWN);
    }

    /**
     * 获取楼层数, 返回结果会进行加一, 为正常的楼层数, 因为在 Layer 类中 layerNumber 是 layer 在 layerList 中的索引
     * @return 返回楼层数
     */
    Integer getLayerNumber() {
        return layerNumber + 1;
    }
}
